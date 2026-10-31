// The collection: each painting's details and the story shown when a puzzle is finished.
// Images live in public/images/<id>.jpg.
export const PAINTINGS = [
  { id: 'mona-lisa', title: 'Mona Lisa', artist: 'Leonardo da Vinci', year: 'c. 1503–1519',
    medium: 'Oil on poplar panel, 77 × 53 cm', home: 'Musée du Louvre, Paris',
    story: [
      'The sitter is almost certainly Lisa Gherardini, wife of the Florentine silk merchant Francesco del Giocondo, which is why the painting is also called La Gioconda. Leonardo never handed it over. He kept working on it for years and carried it with him when he moved to France, where it entered the French royal collection.',
      'For centuries it was admired but not world famous. That changed in August 1911, when Vincenzo Peruggia, a handyman who had worked at the Louvre, walked out with it under his smock. The empty wall made headlines everywhere, and the painting was missing for more than two years before Peruggia tried to sell it in Florence and was caught.',
      'Leonardo built the soft, smoky edges of the face, a technique called sfumato, from many very thin layers of glaze. Today it hangs behind protective glass and draws millions of visitors a year.'
    ] },
  { id: 'starry-night', title: 'The Starry Night', artist: 'Vincent van Gogh', year: '1889',
    medium: 'Oil on canvas, 73.7 × 92.1 cm', home: 'Museum of Modern Art, New York',
    story: [
      'Van Gogh painted this in June 1889 while staying at the asylum of Saint-Paul-de-Mausole in Saint-Rémy-de-Provence, where he had admitted himself after a breakdown. The view is from his east-facing bedroom window just before sunrise. The village and its church spire were added from imagination.',
      'He was not allowed to paint in his bedroom, so he made sketches there and worked on the canvas in a studio downstairs during the day. The brightest "star" near the horizon is probably Venus, which was visible in the dawn sky that month.',
      'Van Gogh himself did not rate the painting highly. He died the following year, and it was only decades later that it became one of the best-known images in the world.'
    ] },
  { id: 'scream', title: 'The Scream', artist: 'Edvard Munch', year: '1893',
    medium: 'Tempera and crayon on cardboard, 91 × 73.5 cm', home: 'National Museum, Oslo',
    story: [
      'Munch described the moment behind it: walking at sunset near Oslo, the sky turned blood red and he felt a great scream passing through nature. The figure is not screaming so much as hearing it, hands pressed to its head.',
      'There are several versions, including two paintings, two pastels and a run of lithograph prints. This 1893 painting was stolen on the opening day of the 1994 Lillehammer Winter Olympics; the thieves climbed a ladder and left a note thanking the museum for its poor security. It was recovered a few months later. Another version was taken at gunpoint from the Munch Museum in 2004 and found two years later.',
      'A tiny pencil line in the sky reads "Could only have been painted by a madman". For years people assumed a vandal wrote it. In 2021 the museum confirmed the handwriting is Munch\'s own.'
    ] },
  { id: 'great-wave', title: 'The Great Wave off Kanagawa', artist: 'Katsushika Hokusai', year: 'c. 1831',
    medium: 'Woodblock print, ink and colour on paper, about 26 × 38 cm', home: 'Many collections, including the Met and the British Museum',
    story: [
      'This is a print, not a single painting. It opened Hokusai\'s series Thirty-six Views of Mount Fuji, and thousands of copies were pulled from the carved blocks, which is why impressions survive in museums around the world.',
      'Hokusai was about seventy when he made it. Look past the claw-like crest and you will find Mount Fuji, small and calm, in the trough of the wave, and three fast boats carrying fishermen and their crews.',
      'The deep blue is Prussian blue, a synthetic pigment newly available in Japan at the time. The print later reached Europe and influenced artists such as Monet, Van Gogh and the composer Debussy.'
    ] },
  { id: 'grande-jatte', title: 'A Sunday on La Grande Jatte', artist: 'Georges Seurat', year: '1884–1886',
    medium: 'Oil on canvas, 207.5 × 308.1 cm', home: 'Art Institute of Chicago',
    story: [
      'Seurat spent about two years on this huge canvas, showing Parisians relaxing on an island in the Seine. He made dozens of drawings and oil sketches on the spot, then built the final picture in his studio.',
      'It is the best-known example of pointillism: instead of mixing colours on the palette, Seurat placed small dots of pure colour side by side and let the eye blend them. He based the method on the colour science of his day.',
      'Look for the details: a woman fishing, a monkey on a leash, a trumpet player. Seurat later added a painted border of dots around the edge. He died at just 31.'
    ] },
  { id: 'impression-sunrise', title: 'Impression, Sunrise', artist: 'Claude Monet', year: '1872',
    medium: 'Oil on canvas, 48 × 63 cm', home: 'Musée Marmottan Monet, Paris',
    story: [
      'Monet painted the port of Le Havre, his hometown, through morning mist, with the orange sun reflected in the water. He showed it at an independent exhibition in Paris in 1874.',
      'A critic, Louis Leroy, mocked the title in a review and called the whole group "Impressionists". The artists took up the insult as their name, and this small canvas gave a whole movement its label.',
      'The sun looks bright, yet it has almost the same lightness as the grey sky around it; it is the colour contrast, not brightness, that makes it glow. The painting was stolen from the museum in 1985 and recovered in Corsica five years later.'
    ] },
  { id: 'water-lily-pond', title: 'The Water Lily Pond', artist: 'Claude Monet', year: '1899',
    medium: 'Oil on canvas', home: 'Several versions, including the National Gallery, London',
    story: [
      'At his home in Giverny, Monet diverted a stream to create a pond, planted it with water lilies and built a Japanese-style footbridge across it. He said his garden was his most beautiful masterpiece.',
      'He painted the bridge and the lilies over and over, and the water lilies became his main subject for the last thirty years of his life, around 250 paintings in all.',
      'In his later years cataracts clouded his vision and his colours grew warmer and more blurred. He had surgery in 1923 and kept painting until his death in 1926.'
    ] },
  { id: 'boating-party', title: 'Luncheon of the Boating Party', artist: 'Pierre-Auguste Renoir', year: '1880–1881',
    medium: 'Oil on canvas, 130.2 × 175.6 cm', home: 'The Phillips Collection, Washington, D.C.',
    story: [
      'The setting is the balcony of the Maison Fournaise, a restaurant on the Seine at Chatou that was popular with rowers. Renoir filled the scene with his friends, who came out to pose over several months.',
      'The young woman at the left playing with a small dog is Aline Charigot, a seamstress who later married Renoir. The man sitting backwards on a chair at the lower right is the painter Gustave Caillebotte, who also supported his fellow artists by buying their work.',
      'The American collector Duncan Phillips bought the painting in 1923, and it remains the best-known work in the museum he founded.'
    ] },
  { id: 'folies-bergere', title: 'A Bar at the Folies-Bergère', artist: 'Édouard Manet', year: '1882',
    medium: 'Oil on canvas, 96 × 130 cm', home: 'The Courtauld Gallery, London',
    story: [
      'This was Manet\'s last major painting, made when he was already seriously ill. The barmaid was a real employee of the Paris music hall, named Suzon, who posed for him at a bar set up in his studio.',
      'Behind her is a mirror, and the reflection does not add up: her reflected back is shifted far to the right, and a man appears in front of her who should block our view. People have argued about whether Manet did this on purpose ever since.',
      'In the top left corner you can spot the green-shoed feet of a trapeze artist. On the counter, the bottles with a red triangle on the label are Bass pale ale.'
    ] },
  { id: 'whistlers-mother', title: 'Whistler\'s Mother', artist: 'James McNeill Whistler', year: '1871',
    medium: 'Oil on canvas, 144.3 × 162.4 cm', home: 'Musée d\'Orsay, Paris',
    story: [
      'Its real title is Arrangement in Grey and Black No. 1. Whistler wanted it seen as a study in colour and form, and was impatient with people who cared about who the sitter was.',
      'The sitter is his mother, Anna McNeill Whistler. One story says a model failed to turn up and she stood in. She found it too tiring to stand for long, so Whistler painted her seated.',
      'The French state bought it in 1891. During the 1930s it toured the United States, and in 1934 it appeared on an American stamp for Mother\'s Day, which helped make it an icon of motherhood.'
    ] },
  { id: 'temeraire', title: 'The Fighting Temeraire', artist: 'J. M. W. Turner', year: '1839',
    medium: 'Oil on canvas, 90.7 × 121.6 cm', home: 'National Gallery, London',
    story: [
      'HMS Temeraire fought at the Battle of Trafalgar in 1805. In 1838 the old warship was towed up the Thames by a steam tug to be broken up for scrap. Turner shows the ghostly sailing ship behind the dark, smoking tug, under a blazing sunset.',
      'It is often read as a farewell to the age of sail. Turner took some liberties: by then the ship\'s masts had already been removed.',
      'He called it his "darling" and refused to sell it, leaving it to the nation. In 2005 it was voted Britain\'s greatest painting in a BBC radio poll, and in 2020 it appeared on the Bank of England £20 note alongside Turner.'
    ] },
  { id: 'woman-in-gold', title: 'Portrait of Adele Bloch-Bauer I', artist: 'Gustav Klimt', year: '1907',
    medium: 'Oil, silver and gold leaf on canvas, 140 × 140 cm', home: 'Neue Galerie, New York',
    story: [
      'Adele was the wife of Ferdinand Bloch-Bauer, a wealthy Viennese sugar industrialist who commissioned the portrait. Klimt worked on it for several years, covering the canvas in real gold and silver leaf during his celebrated "golden phase".',
      'After the Nazis annexed Austria in 1938, the painting was seized from the Jewish family. It later hung in Vienna\'s Belvedere museum under the title "The Lady in Gold", which avoided naming its Jewish sitter.',
      'Adele\'s niece, Maria Altmann, took Austria to court and in 2006 won the painting back. It was then sold to Ronald Lauder for a reported 135 million dollars, at the time a record. The story was told in the 2015 film Woman in Gold.'
    ] },
  { id: 'card-players', title: 'The Card Players', artist: 'Paul Cézanne', year: '1890s',
    medium: 'Oil on canvas', home: 'Five versions, in Paris, London, New York, Philadelphia and a private collection',
    story: [
      'Cézanne painted card players five times in the early 1890s, using farm workers from around his family estate near Aix-en-Provence as models. The versions shrink from crowded scenes to just two men facing each other across a table.',
      'Nobody speaks, nobody smiles, and the cards hardly matter. Cézanne treated the figures almost like still-life objects, building them from solid blocks of colour, an approach that later inspired Cubism.',
      'One of the two-player versions, held privately, was reportedly sold to the royal family of Qatar in 2011 for more than 250 million dollars, among the highest prices ever paid for a painting.'
    ] },
  { id: 'irises', title: 'Irises', artist: 'Vincent van Gogh', year: '1889',
    medium: 'Oil on canvas, 74.3 × 94.3 cm', home: 'J. Paul Getty Museum, Los Angeles',
    story: [
      'Van Gogh painted Irises in his first week at the asylum in Saint-Rémy, working from the hospital garden. He called painting the lightning conductor for his illness, a way to keep himself steady.',
      'Look for the single white iris among the blue ones. The bold outlines and flat areas of colour show how much he had learned from Japanese woodblock prints.',
      'His brother Theo sent it to an exhibition in Paris that same year. In 1987 it sold at auction for 53.9 million dollars, a world record at the time. The Getty Museum bought it in 1990.'
    ] },
  { id: 'wheatfield-crows', title: 'Wheatfield with Crows', artist: 'Vincent van Gogh', year: '1890',
    medium: 'Oil on canvas, 50.5 × 103 cm', home: 'Van Gogh Museum, Amsterdam',
    story: [
      'Van Gogh painted this in July 1890 in Auvers-sur-Oise, a village north of Paris, just weeks before he died. Under a stormy sky, three paths lead into a field of wheat and go nowhere, while black crows scatter overhead.',
      'It is often called his last painting, but that is a myth. His letters and other works show he painted several canvases after it.',
      'In a letter from that month he described painting vast fields of wheat under troubled skies, saying he wanted to express sadness and extreme loneliness, but also the healthy, strengthening power he found in the countryside.'
    ] },
  { id: 'composition-vii', title: 'Composition VII', artist: 'Wassily Kandinsky', year: '1913',
    medium: 'Oil on canvas, 200 × 300 cm', home: 'State Tretyakov Gallery, Moscow',
    story: [
      'Kandinsky is often called a pioneer of abstract art, and he considered Composition VII the most complex work he made before the First World War. He prepared it with more than thirty drawings, watercolours and oil studies.',
      'After all that preparation, he painted the huge final canvas in only about four days.',
      'Kandinsky linked colour with sound and named his biggest works "compositions", as a composer would. Some people see hidden themes in it, such as a flood, resurrection or the Last Judgement, dissolved into pure colour and line.'
    ] }
];
