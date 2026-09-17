package com.kishansetu.app;

import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import java.util.HashMap;
import java.util.Locale;

public class AndroidNativeTTS implements TextToSpeech.OnInitListener {
    private static final String TAG = "KishanNativeTTS";

    private final Activity activity;
    private WebView webView;
    private TextToSpeech tts;
    private boolean isInitialized = false;
    private boolean isSpeaking = false;
    private final Handler mainHandler;

    // Pending utterance if speak() called before onInit completes
    private String pendingText = null;
    private String pendingLang = null;
    private float pendingRate = 1.0f;

    public AndroidNativeTTS(Activity activity) {
        this.activity = activity;
        this.mainHandler = new Handler(Looper.getMainLooper());
        try {
            this.tts = new TextToSpeech(activity.getApplicationContext(), this);
        } catch (Exception e) {
            Log.e(TAG, "Failed to instantiate TextToSpeech", e);
        }
    }

    public void setWebView(WebView webView) {
        this.webView = webView;
    }

    @Override
    public void onInit(int status) {
        if (status == TextToSpeech.SUCCESS) {
            isInitialized = true;
            Log.i(TAG, "Native Android TextToSpeech engine initialized successfully.");

            // Set up UtteranceProgressListener
            tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                @Override
                public void onStart(String utteranceId) {
                    isSpeaking = true;
                    dispatchWebViewEvent("kishan_native_tts_start", utteranceId);
                }

                @Override
                public void onDone(String utteranceId) {
                    isSpeaking = false;
                    dispatchWebViewEvent("kishan_native_tts_end", utteranceId);
                }

                @Override
                public void onError(String utteranceId) {
                    isSpeaking = false;
                    dispatchWebViewEvent("kishan_native_tts_end", utteranceId);
                }

                @Override
                public void onError(String utteranceId, int errorCode) {
                    isSpeaking = false;
                    dispatchWebViewEvent("kishan_native_tts_end", utteranceId);
                }
            });

            // Speak queued speech if any
            if (pendingText != null) {
                String text = pendingText;
                String lang = pendingLang;
                float rate = pendingRate;
                pendingText = null;
                pendingLang = null;
                speakText(text, lang, rate);
            }
        } else {
            Log.e(TAG, "TextToSpeech initialization failed with status: " + status);
            isInitialized = false;
        }
    }

    private Locale resolveLocale(String langCode) {
        if (langCode == null) return new Locale("hi", "IN");
        String code = langCode.trim().toLowerCase(Locale.ROOT);

        if (code.startsWith("hi") || code.contains("hinglish")) {
            return new Locale("hi", "IN");
        } else if (code.startsWith("en")) {
            return new Locale("en", "IN");
        } else if (code.startsWith("pa")) {
            return new Locale("pa", "IN");
        } else if (code.startsWith("mr")) {
            return new Locale("mr", "IN");
        } else if (code.startsWith("gu")) {
            return new Locale("gu", "IN");
        } else if (code.startsWith("bn")) {
            return new Locale("bn", "IN");
        } else if (code.startsWith("te")) {
            return new Locale("te", "IN");
        } else if (code.startsWith("ta")) {
            return new Locale("ta", "IN");
        }

        return new Locale("hi", "IN");
    }

    @JavascriptInterface
    public void speakText(final String text, final String lang, final float rate) {
        if (text == null || text.trim().isEmpty()) return;

        mainHandler.post(() -> {
            if (!isInitialized || tts == null) {
                Log.w(TAG, "TTS not ready yet, queuing speech: " + text);
                pendingText = text;
                pendingLang = lang;
                pendingRate = rate > 0 ? rate : 1.0f;
                return;
            }

            try {
                Locale targetLocale = resolveLocale(lang);
                int check = tts.isLanguageAvailable(targetLocale);
                if (check >= TextToSpeech.LANG_AVAILABLE) {
                    tts.setLanguage(targetLocale);
                } else {
                    Log.w(TAG, "Target language " + targetLocale + " not fully available (code " + check + "), attempting anyway or fallback to hi_IN");
                    int fallbackCheck = tts.setLanguage(targetLocale);
                    if (fallbackCheck < TextToSpeech.LANG_AVAILABLE) {
                        tts.setLanguage(new Locale("hi", "IN"));
                    }
                }

                tts.setSpeechRate(rate > 0 ? rate : 1.0f);
                tts.setPitch(1.0f);

                String utteranceId = "utterance_" + System.currentTimeMillis();

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    Bundle params = new Bundle();
                    params.putString(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, utteranceId);
                    tts.speak(text, TextToSpeech.QUEUE_FLUSH, params, utteranceId);
                } else {
                    HashMap<String, String> params = new HashMap<>();
                    params.put(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, utteranceId);
                    tts.speak(text, TextToSpeech.QUEUE_FLUSH, params);
                }

                isSpeaking = true;
                Log.d(TAG, "Speaking aloud: " + text.substring(0, Math.min(text.length(), 60)) + "...");
            } catch (Exception e) {
                Log.e(TAG, "Error while speaking text: ", e);
                isSpeaking = false;
                dispatchWebViewEvent("kishan_native_tts_end", "error");
            }
        });
    }

    @JavascriptInterface
    public void stopSpeaking() {
        mainHandler.post(() -> {
            try {
                if (tts != null) {
                    tts.stop();
                }
                isSpeaking = false;
                dispatchWebViewEvent("kishan_native_tts_end", "stopped");
            } catch (Exception e) {
                Log.w(TAG, "Error stopping TTS", e);
            }
        });
    }

    @JavascriptInterface
    public boolean isSpeaking() {
        return isSpeaking || (tts != null && tts.isSpeaking());
    }

    @JavascriptInterface
    public boolean isAvailable() {
        return isInitialized && tts != null;
    }

    private void dispatchWebViewEvent(String eventName, String detail) {
        if (webView == null) return;
        mainHandler.post(() -> {
            try {
                String script = String.format(
                    "window.dispatchEvent(new CustomEvent('%s', { detail: { id: '%s' } }));",
                    eventName, detail
                );
                webView.evaluateJavascript(script, null);
            } catch (Exception e) {
                Log.w(TAG, "Failed to dispatch event to WebView: " + eventName, e);
            }
        });
    }

    public void destroy() {
        try {
            if (tts != null) {
                tts.stop();
                tts.shutdown();
                tts = null;
            }
            isInitialized = false;
        } catch (Exception e) {
            Log.w(TAG, "Error shutting down TTS", e);
        }
    }
}
