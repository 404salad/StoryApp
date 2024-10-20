import Dabba from './components/Dabba';
import Header from './components/Header';
import Poly from './components/Poly';

/*
  The Moon River Adventure
  Once upon a time, there was a magical river that flowed across the night sky, glowing softly with the silvery light of the moon. Everyone called it the Moon River, and it was wider than a mile—so wide that no one in the village could see the other side!
  The Moon River was very special. It was said that if you had a wish, you could take a small boat and sail across it under the light of the full moon. At the center of the river, if your heart was true, the moon would hear your wish and make it come true.
  One night, a little girl named Luna decided to make her own journey across the Moon River. Luna had a dream to see the world from above, like the birds that flew high in the sky. She wanted to see the mountains, forests, and even the clouds, just like they did.
  So, when the moon was full and bright, Luna built a tiny boat out of branches and leaves, and set it afloat on the Moon River. The moment she stepped into her boat, the water sparkled around her, and the river began to carry her gently forward.
  As Luna sailed, she looked around in wonder. The river was so wide that it felt like an endless sea of shimmering light. She saw silver fish jumping in and out of the water, and fireflies dancing above her head, lighting her way.
  In the middle of the river, Luna closed her eyes and whispered her wish, “Dear Moon, I wish I could see the world from up high, like the birds do.”
  Suddenly, Luna’s boat began to rise! It lifted out of the water, and then, slowly but surely, it floated up into the air. Luna opened her eyes and gasped—her boat had turned into a beautiful, glowing moon bubble that carried her higher and higher!
  Luna could see everything below her. The tall mountains looked like tiny hills, and the forests were like patches of green. She even saw her little village far in the distance, with lights twinkling like stars.
  She laughed with joy as she floated along, her boat gliding smoothly above the Moon River. The moon smiled down at her, happy to make her wish come true.
  After what felt like hours of exploring the sky, Luna’s boat gently returned to the river, and she sailed back to the shore. She stepped out of her boat with a heart full of happiness and a story she would never forget.
  From that night on, Luna knew that the Moon River really was magical, and that wishes made with a true heart could come true. And whenever she looked up at the moon, she remembered her adventure high above the world, sailing on a river wider than a mile.
  The End.
*/
function App() {
  return (

    <div class='bg-sky h-screen'>
      <Header />
      <Dabba yellow={true} />
      <Dabba yellow={false} />
      <Poly />
    </div>
  );
}

export default App;
