import { createSignal } from 'solid-js';
import { Engine, PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

const Poly = () => {
    const [inputText, setInputText] = createSignal('');
    const [audioUrl, setAudioUrl] = createSignal('');

    const client = new PollyClient({
        region: "us-east-1",
        credentials: {
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        },
    });

    const synthesizeSpeech = async () => {
        const params = {
            Text: inputText(),
            OutputFormat: "ogg_vorbis",
            VoiceId: "Salli",
            Engine: "standard"
        };

        const command = new SynthesizeSpeechCommand(params);

        try {
            const data = await client.send(command);
            if (data.AudioStream instanceof ReadableStream) {
                const reader = data.AudioStream.getReader();
                const result = await reader.read();
                const blob = new Blob([result.value], { type: 'audio/mpeg' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            }
        } catch (error) {
            console.error("Error:", error.message || error);
            if (error.name === 'CredentialProviderError') {
                console.error("Check if your AWS credentials are correctly configured.");
            }
        }
    };

    return (
        <div>
            <input
                type="text"
                value={inputText()}
                onInput={(e) => setInputText(e.target.value)}
            />
            <button onClick={synthesizeSpeech}>Synthesize Speech</button>
            {audioUrl() && <audio src={audioUrl()} controls />}
        </div>
    );
};

export default Poly;
