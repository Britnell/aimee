const api_key = import.meta.env.ELEVENLABS_KEY;

export const elevenRead = (text: string) =>
  fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/VuJ05kimyrfnJmOxLh2k?optimize_streaming_latency=3&output_format=mp3_22050_32`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "xi-api-key": api_key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    }
  );
