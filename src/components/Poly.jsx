import { createSignal, onCleanup } from 'solid-js';
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

function Poly() {
    const [selectedStory, setSelectedStory] = createSignal('');
    const [audioUrl, setAudioUrl] = createSignal('');
    const [storyText, setStoryText] = createSignal(''); // For showing the story gradually
    const [loading, setLoading] = createSignal(false);  // To show a loading effect
    const [displayedText, setDisplayedText] = createSignal('');  // The currently displayed part of the story

    let typingInterval;  // Store interval for cleanup

    const client = new PollyClient({
        region: "us-east-1",
        credentials: {
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        },
    });

    const stories = {
        "Story 1": "Once upon a time in a faraway landOnce upon a time in a faraway land...Once upon a time in a faraway land...Once upon a time in a faraway land...Once upon a time in a faraway land...Once upon a time in a faraway land...Once upon a time in a faraway land...Once upon a time in a faraway land......",
        "Story 2": "The quick brown fox jumps over the lazy dog.",
        "Story 3": "In the beginning, there was nothing but darkness."
    };

    const synthesizeSpeech = async () => {
        if (!selectedStory()) return;

        const params = {
            Text: stories[selectedStory()],
            OutputFormat: "ogg_vorbis",
            VoiceId: "Salli",
            Engine: "standard"
        };

        const command = new SynthesizeSpeechCommand(params);

        try {
            const data = await client.send(command);
            if (data.AudioStream instanceof ReadableStream) {
                const reader = data.AudioStream.getReader();
                const audioChunks = [];

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    audioChunks.push(value);
                }

                const blob = new Blob(audioChunks, { type: 'audio/ogg' });
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

    const startTypingEffect = () => {
        setDisplayedText('');  // Reset the displayed text
        setLoading(true);      // Start loading

        const fullText = stories[selectedStory()];
        let currentIndex = 0;

        typingInterval = setInterval(() => {
            if (currentIndex < fullText.length) {
                setDisplayedText((prev) => prev + fullText[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                setLoading(false); // Stop loading once the full story is displayed
                synthesizeSpeech(); // Play the speech after story is fully displayed
            }
        }, 50);  // Adjust speed of typing effect (milliseconds between each character)
    };

    onCleanup(() => {
        if (typingInterval) clearInterval(typingInterval);
    });

    return (
        <div>
            {/* Dropdown to select a story */}
            <select
                value={selectedStory()}
                onChange={(e) => {
                    setSelectedStory(e.target.value);
                    setStoryText(stories[e.target.value]);  // Store full story
                    startTypingEffect();  // Trigger the typing effect
                }}
                class="m-3 w-fit border-black border-4 rounded-xl text-center text-5xl py-5 px-40 bg-white"
            >
                <option value="">Select a story</option>
                {Object.keys(stories).map((title) => (
                    <option value={title}>{title}</option>
                ))}
            </select>

            {/* Loading message */}
            {loading() && (
                <div class="m-3 p-5 text-3xl text-gray-500">
                    Generating story...
                </div>
            )}

            {/* Story text gradually revealed */}
            {!loading() && selectedStory() && (
                <div class="m-3 p-5 border border-gray-300 rounded-lg bg-gray-100 text-3xl">
                    {displayedText()}
                </div>
            )}

            {/* Autoplaying audio of the synthesized speech */}
            {audioUrl() && <audio src={audioUrl()} controls autoPlay />}
        </div>
    );
}

export default Poly;
