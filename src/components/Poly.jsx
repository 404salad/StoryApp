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
        "The Little Star": "High up in the sky, a tiny star felt lonely. One night, it zoomed down to visit a forest. The animals welcomed it, dancing under its twinkling light. When morning came, the star whispered it would shine brighter that night so they could play again, and it sparkled happily ever after.",
        "The Sleepy Owl": "Owl wanted to stay awake all night, but his eyes kept closing. He kept saying just five more minutes. The moon smiled and reminded him that even owls need rest. Owl finally curled up on a cozy branch, dreaming of starlit skies and morning sunshine.",
        "The Lost Raindrop": "A little raindrop drifted away from its cloud family and floated down to land on a flower petal. The flower told it not to worry because the sky would call it back soon. As the sun came out, the raindrop evaporated, rejoining the clouds and feeling happy to be home again."
    };

    const synthesizeSpeech = async () => {
        if (!selectedStory()) return;

        const params = {
            Text: stories[selectedStory()],
            OutputFormat: "ogg_vorbis",
            VoiceId: "Salli",
            Engine: "standard"
            // VoiceId: "Ruth",
            // Engine: "generative"
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
        }, 10);  // Adjust speed of typing effect (milliseconds between each character)
    };

    onCleanup(() => {
        if (typingInterval) clearInterval(typingInterval);
    });

    return (
        <div style={{ backgroundColor: '#FFEB3B', color: '#2196F3' }} class="flex flex-col items-center justify-center l-screen">
            {/* Dropdown to select a story */}
            <select
                style={{ backgroundColor: '#FF9800', color: 'black' }}
                value={selectedStory()}
                onChange={(e) => {
                    setSelectedStory(e.target.value);
                    setStoryText(stories[e.target.value]);  // Store full story
                    startTypingEffect();  // Trigger the typing effect
                }}
                class="m-3 w-fit border-black border-4 rounded-xl text-left text-5xl py-5 px-40 bg-white"
            >
                <option value="">Select a story</option>
                {Object.keys(stories).map((title) => (
                    <option value={title} key={title}>{title}</option>
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
                <div class="m-3 p-5 border border-gray-300 rounded-lg bg-gray-100 text-3xl text-center">
                    {displayedText()}
                </div>
            )}

            {/* Autoplaying audio of the synthesized speech */}
            {audioUrl() && <audio src={audioUrl()} controls autoPlay />}
        </div>
    );
}

export default Poly;
