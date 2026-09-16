const { createClient } = require('@sanity/client');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error('ERRO: SANITY_WRITE_TOKEN não encontrado em .env.local');
  process.exit(1);
}

const client = createClient({
  projectId: 'qf5spdw9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: token,
  useCdn: false,
});

const ALESSANDRO_AUTHOR_ID = 'WlQi0L45SAS7jwvJmFYmmD';

function makeBlock(text) {
  return {
    _type: 'block',
    _key: crypto.randomBytes(6).toString('hex'),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: crypto.randomBytes(6).toString('hex'),
        text: text,
        marks: [],
      },
    ],
  };
}

function makeYoutubeBlock(url) {
  return {
    _type: 'youtube',
    _key: 'yt_' + crypto.randomBytes(6).toString('hex'),
    url: url,
  };
}

const posts = [
  {
    id: 'post-alessandro-audio01-cruz',
    title: 'A Cruz Não Foi Só Madeira',
    slug: 'a-cruz-nao-foi-so-madeira',
    category: 'Espiritualidade',
    readingTime: 2,
    publishedAt: '2026-09-10T16:55:00Z',
    youtubeUrl: 'https://youtu.be/4CyxDTVbjVc',
    excerpt: 'A cruz não foi só madeira: foi uma declaração de amor e de perdão. Ali no alto não havia apenas dor — havia entrega. "Está consumado" não foi o fim, foi o recomeço de tudo.',
    paragraphs: [
      'A cruz não foi só madeira: foi uma declaração de amor e de entrega total.',
      'Ali no alto do Gólgota não havia apenas o sofrimento do corpo — havia doação incondicional, havia o perdão que rompe as amarras do rancor e desarma o ódio humano.',
      '"Está consumado" não foi um grito de fim ou derrota; foi o início sagrado de tudo o que podia ser curado, restaurado e acolhido pelo amor divino.',
      'Às vezes, na nossa caminhada humana, o que aos olhos do mundo parece perda, silêncio ou fracasso é apenas o caminho necessário para a maior das vitórias interiores.',
      'Que você possa olhar para as suas cruzes diárias não como fardos de desespero, mas como o espaço fecundo onde a graça se revela e a esperança renasce com firmeza e paz.',
    ],
  },
  {
    id: 'post-alessandro-audio02-maria',
    title: 'Por Que Maria Ficou em Silêncio?',
    slug: 'por-que-maria-ficou-em-silencio',
    category: 'Espiritualidade',
    readingTime: 2,
    publishedAt: '2026-09-10T16:56:00Z',
    youtubeUrl: 'https://youtu.be/L0Qlqpfk7do',
    excerpt: 'Por que Maria guardou tudo no silêncio do coração? No silêncio não há ausência de resposta, mas a maturidade sagrada de esperar a promessa divina florescer.',
    paragraphs: [
      'Por que Maria guardou tudo no silêncio do coração diante de mistérios tão grandiosos?',
      'Ela viu anjos, ouviu profecias surpreendentes, carregou o Criador nos braços e testemunhou a incompreensão do mundo. No entanto, o Evangelho nos ensina: "Maria guardava todas estas coisas e as meditava no seu coração".',
      'O silêncio de Maria não foi omissão, conformismo ou medo. Foi a profundidade espiritual de quem sabe que as obras de Deus não se realizam no alvoroço das palavras apressadas nem na ansiedade dos homens.',
      'O silêncio sagrado é a terra fértil onde a promessa ganha raízes firmes. Quando o mundo ao seu redor gritar cobranças e incertezas, aprenda com Maria a silenciar por dentro, porque é no recolhimento sereno que a voz de Deus se faz límpida e acolhedora.',
    ],
  },
  {
    id: 'post-alessandro-audio03-jesus-areia',
    title: 'O Que Jesus Escreveu na Areia?',
    slug: 'o-que-jesus-escreveu-na-areia',
    category: 'Reflexões',
    readingTime: 2,
    publishedAt: '2026-09-10T16:57:00Z',
    youtubeUrl: 'https://youtu.be/wpVE7C08HGQ',
    excerpt: 'Enquanto todos apontavam pedras e julgamentos para a mulher, Jesus se abaixou e escreveu na areia. Uma meditação comovente sobre perdão, hipocrisia e misericórdia.',
    paragraphs: [
      'Enquanto uma multidão indignada cercava a mulher adúltera, com pedras nas mãos e dedos em riste prontos para condenar, Jesus surpreendeu a todos: abaixou-se e começou a escrever na areia.',
      'O que ele escreveu? Os pecados ocultos dos próprios acusadores? As fragilidades que todos nós carregamos? Ou apenas desenhou o silêncio da terra diante da hipocrisia humana?',
      'Ao não responder com a fúria do tribunal popular, Jesus quebrou a roda da violência. E quando finalmente se ergueu, colocou o espelho da verdade diante de cada coração: "Aquele que dentre vós estiver sem pecado, seja o primeiro a atirar-lhe uma pedra".',
      'Um a um, dos mais velhos aos mais jovens, foram se retirando com suas próprias culpas. Ficaram apenas dois: a miséria humana e a infinita misericórdia. O convite do Evangelho para nós é soltar as pedras do julgamento e acolher com o olhar restaurador de Cristo.',
    ],
  },
  {
    id: 'post-alessandro-audio04-debora',
    title: 'Débora, a Mulher Que Comandou um Exército',
    slug: 'debora-a-mulher-que-comandou-um-exercito',
    category: 'Mulheres - Lutas Sociais',
    readingTime: 2,
    publishedAt: '2026-09-10T16:58:00Z',
    youtubeUrl: 'https://youtu.be/yyZNzkZzX7c',
    excerpt: 'Ela comandou uma nação e quase ninguém lembra o seu nome. Enquanto os homens hesitavam pelo medo, Débora se levantou como juíza, profetisa e mãe em Israel.',
    paragraphs: [
      'Ela comandou um exército, inspirou uma nação inteira e quase ninguém lembra o seu nome nas pregações convencionais.',
      'Débora foi juíza, profetisa, líder e poetisa. Em um tempo de dominação patriarcal e opressão, enquanto os líderes militares hesitavam paralisados pelo medo e pela dúvida, Débora se levantou com firmeza, fé e profunda sensibilidade.',
      'Não pediu licença para agir com justiça, não esperou ser chamada duas vezes. Ela ouviu a voz de Deus, sentiu a dor do seu povo e colocou-se na linha de frente da libertação.',
      'Às vezes a verdadeira coragem não precisa de alarde nem gritos; ela simplesmente se levanta e vai. Débora é farol e inspiração para todas as mulheres que, dia após dia, sustentam suas famílias, comunidades e lutas com dignidade inquebrantável.',
    ],
  },
  {
    id: 'post-alessandro-audio05-semente-terra',
    title: 'A Semente e os Quatro Tipos de Terra: Qual É o Seu Chão?',
    slug: 'a-semente-e-os-quatro-tipos-de-terra',
    category: 'Reflexões',
    readingTime: 2,
    publishedAt: '2026-09-10T16:59:00Z',
    youtubeUrl: 'https://youtu.be/VY1_jFJ4pBU',
    excerpt: 'A semente do amor é a mesma, mas qual é o chão que o seu coração oferece a ela? Uma meditação poética sobre raízes, solo interior e abertura à graça.',
    paragraphs: [
      'A semente caiu em quatro tipos de terra. E a pergunta que ecoa no fundo da nossa alma é: qual é o seu chão hoje?',
      'Há a terra dura, pisoteada pela correria e pela amargura, que não deixa nenhuma palavra de ternura entrar. Há a terra rasa e pedregosa, que começa com entusiasmo aparente, mas ao menor calor da provação seca por falta de raízes profundas.',
      'Há também a terra cheia de espinhos, onde a ansiedade excessiva, a busca desenfreada por bens e as preocupações sufocam os brotos mais nobres do espírito.',
      'E há a terra boa: aquela que escuta com docilidade, acolhe com humildade e dá frutos abundantes de partilha e fraternidade. A semente do Evangelho é sempre fecunda; a diferença está na generosidade do chão onde ela cai. Cuide do seu solo.',
    ],
  },
  {
    id: 'post-alessandro-audio06-joaozinho',
    title: 'Joãozinho, Dê Sua Mão, Levanta-se: A Força do Resgate Fraterno',
    slug: 'joaozinho-de-sua-mao-levanta-se',
    category: 'Espiritualidade',
    readingTime: 6,
    publishedAt: '2026-09-10T17:00:00Z',
    youtubeUrl: 'https://youtu.be/w_wUtmFEpKA',
    excerpt: 'A comovente história de André e João. Quando a dor e o vício levaram João às calçadas da rua, foi o abraço desarmado do amigo de infância que o fez renascer para o altar.',
    paragraphs: [
      'Dois jovens tinham um sonho partilhado: entregar suas vidas ao ministério sacerdotal e servir ao povo de Deus. André e João, companheiros inseparáveis desde a infância, fizeram todo o acompanhamento vocacional e, ao concluírem o ensino médio, ingressaram juntos no seminário.',
      'Percorreram a longa caminhada da formação integral: os estudos intensos de filosofia, a teologia e as experiências pastorais junto às comunidades. João, comunicativo e sensível, também gostava nas horas de descanso de estar entre amigos, partilhando um momento festivo. Tudo de forma equilibrada no início.',
      'Os anos se cumpriram, e o dia da ordenação foi uma bênção luminosa celebrada por familiares e pela comunidade. Cada um foi enviado para sua paróquia. Com o passar do tempo, no entanto, as pressões silenciosas da solidão e as fraquezas humanas abriram brechas no coração de João. O consumo de bebida foi perdendo o controle, tornando-se um caminho doloroso de dependência.',
      'A comunidade tentou acolher e informou o bispo, que o chamou com carinho e pediu que se tratasse. Mas o abismo do vício era profundo. João foi afastado das atividades pastorais. Voltou à casa da família, tentou recomeçar, mas a vergonha o dominou. Em um ato de desespero, entregue ao álcool e ao isolamento, deixou a família e sumiu no mundo das ruas.',
      'Passaram-se três anos dolorosos. Aquele homem sábio, de inteligência brilhante e coração pastoral, vivia agora como morador de rua. Roupas rasgadas, barba e cabelos compridos, maltrapilho, passava os dias sentado nos degraus de uma igrejinha de pequena cidade, com um boné virado para cima esperando a esmola de quem passava.',
      'Aconteceu que o padre daquela matriz, ao chegar para a missa das sextas-feiras, começou a notar aquele mendigo solitário. Na terceira sexta-feira, movido por uma compaixão profunda, aproximou-se para conversar. Ao ouvir aquela voz rouca responder com nobreza, paralisou: era o seu querido amigo de seminário, o padre João.',
      'André não o julgou, não deu lições de moral nem o censurou. Abraçou aquele corpo ferido e perguntou com lágrimas: "Meu amigo, como você chegou até aqui?". João, de cabeça baixa, desabafou: "Estou sem rumo, entregue ao vício. Quero sair, mas tenho vergonha de voltar".',
      'Na intimidade de quem conhece a essência do outro desde menino, André segurou forte a mão do amigo e disse: "Joãozinho, dê a sua mão, levanta-se! Hoje você vai concelebrar a missa comigo". João hesitou: "Não posso, André... não tenho túnica, não tenho estola, estou sujo". André sorriu com a ternura do Evangelho: "Nada disso importa. Vamos para a casa paroquial agora".',
      'Lá, André chamou um amigo cabeleireiro, que cuidou de João com respeito e carinho. Deram-lhe um banho revigorante, novas vestes, túnica e estola. Naquela noite de sexta-feira, os dois amigos de infância subiram juntos ao altar para consagrar o pão e o vinho. João foi resgatado pelo amor incondicional que não desiste de ninguém.',
      'Às vezes, Deus não transforma a vida de uma pessoa por meio de um raio extraordinário vindo do céu. Ele transforma porque um amigo de verdade tem a coragem evangélica de estender a mão e dizer: Joãozinho, dê a sua mão, levanta-se.',
    ],
  },
  {
    id: 'post-alessandro-audio07-governar',
    title: 'Governar com o Coração: O Verdadeiro Sentido do Poder',
    slug: 'governar-com-o-coracao',
    category: 'Reflexões',
    readingTime: 3,
    publishedAt: '2026-09-10T17:01:00Z',
    youtubeUrl: 'https://youtu.be/Mty0meh62kM',
    excerpt: 'Olhando para a Bíblia e para os filósofos: qual é a missão de quem lidera? Governar não é buscar poder para si, mas servir ao povo com discernimento, justiça e compaixão.',
    paragraphs: [
      'Olhando atentamente para as Sagradas Escrituras e para as reflexões dos grandes filósofos ao longo da história, uma indagação primordial ecoa dentro de mim: qual é o verdadeiro papel de quem tem a responsabilidade de governar um povo?',
      'O governante autêntico precisa cultivar três virtudes fundamentais: sensibilidade para escutar o clamor das ruas, determinação ética e coragem prudente para tomar decisões visando sempre o bem de todos e todas.',
      'Aquele que se dispõe a ouvir amplamente antes de decidir, que sabe delegar, descentralizar o poder e abrir espaços reais de participação popular, multiplica imensamente as chances de acertar. É muito mais nobre a humildade de buscar o acerto coletivo — e se necessário errar juntos em prol do bem comum — do que alimentar o orgulho solitário da prepotência, sacrificando o povo na vaidade do poder.',
      'Governar não é pensar por si nem agir em benefício próprio; é agir pelo povo e com o povo. É ter capacidade madura de gerenciar conflitos sem recorrer à violência, avaliando e corrigindo as rotas sempre que a justiça exigir.',
      'Primeiro, enxergamos a realidade com os olhos atentos da verdade. Em seguida, ponderamos com o rigor da razão. Mas é fundamentalmente com o coração que se deve governar. A grandeza de um líder não se mede apenas pelas obras de pedra e cal, mas pela firmeza de seus ideais e pela capacidade de caminhar ombro a ombro com a sua gente.',
    ],
  },
  {
    id: 'post-alessandro-audio08-agradecer',
    title: 'Por Que Agradecer, Senhor Deus? Uma Prece Pela Casa Comum',
    slug: 'por-que-agradecer-senhor-deus',
    category: 'Espiritualidade',
    readingTime: 3,
    publishedAt: '2026-09-10T17:02:00Z',
    youtubeUrl: 'https://youtu.be/1xTncsaNVkY',
    excerpt: 'Pelo dom da vida, pelo ar que respiramos e pela Mãe Terra que nos acolhe: uma oração poética de gratidão, resistência profética e compromisso com o Evangelho.',
    paragraphs: [
      'Pai Deus, queremos agradecer profundamente pelo dom sagrado da vida, pelo ar que enche os pulmões, pela água pura que sacia a sede, pelo sol que renova cada alvorada e pela Mãe Terra que nos acolhe generosamente em seu ventre maternal.',
      'Neste chão fértil onde vivemos, tecemos relações e edificamos nossos sonhos, reconhecemos a nossa Casa Comum: nosso teto compartilhado, nosso abrigo e nossa herança mais preciosa.',
      'Senhor Deus, fortalece nossos passos na caminhada. Enche nossos corações de coragem, resistência ativa, perseverança, sabedoria e serenidade nestes tempos tão desafiadores em que vivemos — marcados tantas vezes pelo individualismo estéril, pela ganância desenfreada e pela exclusão dos mais vulneráveis.',
      'Ajuda-nos a sermos profetas e profetisas através dos nossos gestos cotidianos, de nossas ações de acolhimento e de cada palavra proferida. Derrama sobre todos e todas o Teu Espírito de concórdia para fazermos do mundo um território de esperança, fraternidade e paz.',
      'Que a nossa busca pelo saber e o aprofundamento da nossa fé comunitária sejam uma sede constante que nos impulsione a servir melhor o Teu povo. Por tudo o que nos deste e pela missão que nos confiaste, Senhor, nós Te louvamos e Te agradecemos hoje e sempre.',
    ],
  },
  {
    id: 'post-alessandro-mentira-verdade',
    title: 'A Mentira e a Verdade do Evangelho: O Compromisso com a Palavra',
    slug: 'a-mentira-e-a-verdade-do-evangelho',
    category: 'Reflexões',
    readingTime: 2,
    publishedAt: '2026-09-08T10:00:00Z',
    excerpt: 'Invenção, distorção ou omissão: as três faces da mentira que corroem as relações humanas. A mensagem libertadora do Evangelho que nos conclama à sinceridade.',
    paragraphs: [
      'A mentira pode se manifestar na convivência sob diferentes roupagens e disfarces. Há a mentira por pura invenção, quando se cria o que jamais existiu para prejudicar ou iludir. Há a mentira por distorção, quando se manipulam fatos legítimos para favorecer interesses escusos.',
      'E há, de forma muito sutil e perigosa, a mentira por omissão: quando se cala intencionalmente o que deveria ser revelado, conduzindo o irmão e a irmã ao engano e à injustiça.',
      'Essas diferentes formas de falsidade ferem de morte a confiança mútua, fragmentam laços de afeto e enfraquecem a vida em comunidade. Quando a verdade é trocada pela conveniência covarde ou pelo medo das consequências, toda a sociedade padece.',
      'O Evangelho de Jesus Cristo nos convida a romper com esses subterfúgios e cultivar diariamente a sinceridade, a honestidade e a responsabilidade com a palavra dada. Falar a verdade com amor e mansidão é o alicerce indispensável para sustentar a justiça, a paz e a dignidade de todos e todas.',
    ],
  },
  {
    id: 'post-alessandro-fe-e-vida',
    title: 'Fé e Vida Caminham Juntas: A Espiritualidade das Obras',
    slug: 'fe-e-vida-caminham-juntas',
    category: 'Espiritualidade',
    readingTime: 2,
    publishedAt: '2026-09-07T10:00:00Z',
    youtubeUrl: 'https://youtu.be/Dm1BACUS5Jo',
    excerpt: 'Fé e vida não podem ser separadas. Uma fé autêntica sai do comodismo das palavras para se tornar acolhimento aos pobres, cuidado da vida e prática concreta da justiça.',
    paragraphs: [
      'Fé e vida caminham sempre entrelaçadas. Muitos de nós tivemos a bênção de receber a fé como tesouro transmitido pelos nossos antepassados, cultivado no seio da família e na simplicidade das comunidades de fé.',
      'No entanto, somos chamados constantemente a amadurecer essa semente, dando passos conscientes rumo a uma espiritualidade assimilada no coração, aprofundada pelo estudo e capaz de iluminar as encruzilhadas do nosso tempo.',
      'Uma fé viva não se fecha na redoma dos costumes acomodados. Ela escuta com reverência a Palavra de Deus, desperta a consciência crítica, alimenta a esperança diante dos desafios e sabe discernir a história com os olhos do Evangelho.',
      'Quando a fé desce ao chão da vida cotidiana, ela se converte em compromisso palpável: promove a justiça social, acolhe os empobrecidos, cuida com ternura da nossa Casa Comum e transforma pequenos gestos em sementes do Reino de Deus — tornando-nos discípulos e discípulas comprometidos com a plenitude da vida para todos e todas.',
    ],
  },
  {
    id: 'post-alessandro-casa-comum',
    title: 'O Ser Humano e a Casa Comum: Conversão Ecológica e Fraternidade',
    slug: 'o-ser-humano-e-a-casa-comum',
    category: 'Espiritualidade',
    readingTime: 2,
    publishedAt: '2026-09-06T10:00:00Z',
    youtubeUrl: 'https://youtu.be/DVGUNYIls7o',
    excerpt: 'Não somos proprietários da criação, mas guardiões da vida. Cuidar da terra, da água e dos seres é um dever sagrado de fé e de compromisso com as próximas gerações.',
    paragraphs: [
      'O ser humano e a criação caminham juntos na harmonia pensada pelo Criador. Não fomos instituídos proprietários absolutos da natureza, mas guardiões fraternos de cada sopro de vida.',
      'A terra que nos sustenta, as fontes de água límpida, o ar que respiramos e toda a biodiversidade são dons gratuitos confiados à nossa responsabilidade, gratidão e cuidado contínuo.',
      'Quando degradamos o meio ambiente pela ganância do lucro desmedido, ferimos profundamente a dignidade humana — e são sempre as famílias mais pobres e marginalizadas as que sofrem primeiro e com maior crueza os impactos do desequilíbrio ecológico.',
      'Defender a Casa Comum é um dever inegociável de fé e de justiça para com as gerações que hão de vir. Somos chamados a uma verdadeira conversão ecológica que renove o nosso olhar, inspire novos hábitos e transforme cada gesto de proteção à criação em testemunho vivo do amor de Deus por todos e todas.',
    ],
  },
];

async function run() {
  console.log('Iniciando publicação dos 11 posts de Alessandro Poeta no Sanity CMS...');

  for (const p of posts) {
    const bodyBlocks = [];

    // Se houver vídeo do YouTube, adiciona o bloco no início do post
    if (p.youtubeUrl) {
      bodyBlocks.push(makeYoutubeBlock(p.youtubeUrl));
    }

    // Adiciona os parágrafos de texto autoral
    for (const paragraph of p.paragraphs) {
      bodyBlocks.push(makeBlock(paragraph));
    }

    const doc = {
      _id: p.id,
      _type: 'post',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      author: {
        _type: 'reference',
        _ref: ALESSANDRO_AUTHOR_ID,
      },
      category: p.category,
      excerpt: p.excerpt,
      readingTime: p.readingTime,
      publishedAt: p.publishedAt,
      body: bodyBlocks,
    };

    try {
      const res = await client.createOrReplace(doc);
      console.log(`✅ [${res._id}] "${p.title}" publicado com sucesso!`);
    } catch (err) {
      console.error(`❌ Erro ao publicar "${p.title}":`, err.message);
    }
  }

  console.log('\n--- Finalizado com sucesso! ---');
}

run();
