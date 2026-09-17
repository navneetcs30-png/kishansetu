package com.kishansetu.app;

import android.webkit.WebSettings;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "KishanTTS")
public class KishanTTSPlugin extends Plugin {
    private AndroidNativeTTS nativeTTS;

    @Override
    public void load() {
        super.load();
        if (getActivity() != null) {
            nativeTTS = new AndroidNativeTTS(getActivity());
            if (getBridge() != null && getBridge().getWebView() != null) {
                nativeTTS.setWebView(getBridge().getWebView());
                getBridge().getWebView().addJavascriptInterface(nativeTTS, "AndroidNativeTTS");

                getActivity().runOnUiThread(() -> {
                    try {
                        WebSettings settings = getBridge().getWebView().getSettings();
                        settings.setMediaPlaybackRequiresUserGesture(false);
                    } catch (Exception ignored) {}
                });
            }
        }
    }

    @PluginMethod
    public void speak(PluginCall call) {
        String text = call.getString("text");
        String lang = call.getString("lang", "hi-IN");
        Double rateObj = call.getDouble("rate", 1.0);
        float rate = rateObj != null ? rateObj.floatValue() : 1.0f;

        if (text == null || text.trim().isEmpty()) {
            call.reject("Text cannot be empty");
            return;
        }

        if (nativeTTS != null) {
            nativeTTS.speakText(text, lang, rate);
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } else {
            call.reject("Native TTS engine not available");
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (nativeTTS != null) {
            nativeTTS.stopSpeaking();
        }
        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void isSpeaking(PluginCall call) {
        boolean speaking = nativeTTS != null && nativeTTS.isSpeaking();
        JSObject ret = new JSObject();
        ret.put("speaking", speaking);
        call.resolve(ret);
    }

    @Override
    protected void handleOnDestroy() {
        if (nativeTTS != null) {
            nativeTTS.destroy();
            nativeTTS = null;
        }
        super.handleOnDestroy();
    }
}
