package com.careprovider;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.sentry.RNSentryPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.oblador.keychain.KeychainPackage;
import com.gettipsi.stripe.StripeReactPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.hoxfon.react.RNTwilioVoice.TwilioVoicePackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.cardio.RNCardIOPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSentryPackage(),
            new MapsPackage(),
            new KeychainPackage(),
            new StripeReactPackage(),
            new ImagePickerPackage(),
            new FingerprintAuthPackage(),
            new TwilioVoicePackage(),
            new RNGeocoderPackage(),
            new RNFusedLocationPackage(),
            new ReactNativePushNotificationPackage(),
            new VectorIconsPackage(),
            new ReanimatedPackage(),
            new RNGestureHandlerPackage(),
            new RNCardIOPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
