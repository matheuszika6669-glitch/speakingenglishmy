// 10 histórias adaptadas de matérias do VOA Learning English (texto produzido só pelo VOA, de domínio público),
// reescritas em inglês simples (A2/B1), com vocabulário em português e pontos-chave para a conferência.
// Foram descartadas as matérias que citam AP/AFP/Reuters (têm direitos de terceiros).
const H = (id, kind, level, title, text, gl, kp) => ({ id, kind, level, title, text, gl, kp: kp.map(k => ({ pt: k[0], kw: k[1] })) });
module.exports = [
H('s7','work','B1','Writing a Good Email',
`Email is one of the most common ways to communicate at work. A good email helps people read it and answer quickly.

Start with a clear subject line. It should be short and say what the message is about. The word "important" alone is not enough. A better subject is "Meeting Tomorrow at 10 a.m. to Discuss New Changes."

Then choose the right greeting. With a friend or a coworker, you can write "Hello, Ana." In a formal email to someone you do not know, write "Dear Mr. Smith" or "To Whom It May Concern."

Keep the message short and polite, say what you need, and end with a closing like "Best regards." Read it again before you send it.`,
[['subject line','assunto do e-mail'],['greeting','saudação'],['formal','formal'],['coworker','colega de trabalho'],['to answer','responder'],['closing','despedida']],
[['O assunto deve ser curto e claro',['subject','short','clear']],['Só "important" não basta',['important','enough']],['A saudação depende de quem recebe',['greeting','formal','friend','dear','coworker']],['A mensagem deve ser curta e educada',['short','polite','closing','regards']],['Reler antes de enviar',['read','again','before','send']]]),
H('s8','work','B1','Too Much on Your Plate',
`Many people have a lot to do. They have jobs, family, friends, and personal projects. When we try to do too much, we may "spread ourselves too thin." This means we have taken on more than we can handle.

Another way to say it is "to bite off more than you can chew." If you work on many projects at the same time, none of them may be done well. You can also feel very stressed.

Imagine a teacher whose students all miss a deadline. They act in the same play, practice every night, and have part-time jobs. They are spread too thin. The teacher decides to extend the deadline to give them more time.`,
[['to spread yourself too thin','assumir coisas demais'],['to bite off more than you can chew','dar um passo maior que a perna'],['overwhelmed','sobrecarregado'],['deadline','prazo'],['to extend','prorrogar'],['rehearsal','ensaio']],
[['Muitas pessoas têm muitas responsabilidades',['job','family','project','responsib']],['A expressão significa assumir mais do que dá conta',['too much','more than','spread','bite']],['Muitos projetos ao mesmo tempo: estresse e trabalho mal feito',['stress','well','none']],['Os alunos perderam um prazo',['deadline','students','miss']],['A professora prorrogou o prazo',['extend','more time','teacher']]]),
H('s9','work','B1','Learning New Skills Fast',
`The workplace changes quickly, and old college courses may not be enough. For example, many technology workers do not use the computer languages from the 1990s. Now they may need Python or SQL.

One answer is a microcredential. It is a short professional course in a narrow field, and it can last from one week to one month. Popular topics are data analysis, IT support, and cybersecurity.

Big technology companies like Google and IBM often create these courses and give a certificate at the end. Many colleges in the United States also accept some of them for school credit. Students can search for the right course by field or industry.`,
[['workplace','local de trabalho'],['microcredential','curso curto com certificado'],['certificate','certificado'],['cybersecurity','segurança digital'],['narrow','específico, restrito'],['school credit','crédito acadêmico']],
[['O trabalho muda e cursos antigos podem não bastar',['change','old','college','enough']],['Microcredencial é um curso curto e específico',['short','week','month','narrow','microcredential']],['Áreas populares: dados, TI, segurança digital',['data','cybersecurity','it ','support']],['Empresas criam os cursos e dão certificado',['google','ibm','compan','certificate']],['Faculdades aceitam como crédito',['credit','college']]]),
H('s10','work','B1','A Business Starts at Home',
`Mary Kay was born in Texas in 1918. When her marriage ended, she needed a job to support her three children, so she began selling different products.

One night she tried some homemade skin care products at a customer's home, and she liked them. She paid five hundred dollars for the rights to the products and, in 1963, she started her own company in Dallas, Texas.

The idea was simple: sales representatives sold the products at demonstrations in homes and offices. Each woman who brought new people into the company also earned part of their sales, so experienced sellers wanted to train new ones. In two years the company was selling almost one million dollars in products.`,
[['to support','sustentar'],['skin care','cuidados com a pele'],['rights','direitos'],['sales representative','representante de vendas'],['to train','treinar'],['earnings','ganhos']],
[['Ela precisava de um emprego para sustentar os filhos',['job','children','support']],['Experimentou produtos caseiros e gostou',['skin','product','homemade','liked']],['Comprou os direitos e abriu a empresa em 1963 em Dallas',['rights','500','five hundred','1963','dallas','company']],['As vendas eram feitas em demonstrações em casas e escritórios',['demonstrat','homes','offices','representative']],['Quem trazia vendedoras novas ganhava uma parte',['part','earn','train','new']],['Em dois anos vendia quase um milhão',['million','two years','1965','sold','selling']]]),
H('s11','work','A2','Dialed In',
`Some English expressions come from old technology. A dial was used to tune in to a radio station. If the signal was clear, you heard the program without noise.

Today we use the same idea for people. If you are "dialed in" to a project, you know exactly what to do, and you stay focused. If you are "tuned in," you understand what is happening around you.

When a radio host says "stay tuned," it means "keep listening." And to "flip the switch" means to make something happen quickly and easily, or to change something suddenly.`,
[['dial','botão giratório'],['to tune in','sintonizar'],['static','chiado'],['focused','concentrado'],['switch','interruptor'],['to flip','virar, acionar']],
[['Algumas expressões vêm de tecnologia antiga',['old','technology','radio','dial']],['O dial servia para sintonizar uma estação',['tune','station','channel','clear']],['"Dialed in" é saber o que fazer e ficar focado',['dialed in','focused','project','know']],['"Tuned in" é entender o que acontece ao redor',['tuned in','understand','around']],['"Stay tuned" e "flip the switch"',['stay tuned','keep','flip','switch','quickly']]]),
H('s12','travel','A2','Yellowstone, the First National Park',
`Yellowstone National Park is in the western United States, mostly in Wyoming. It opened in 1872 and was the first national park in the world.

The park has mountains, lakes, rivers, deep canyons, and many wild animals. It also sits on top of a very old volcano. Because of the heat under the ground, hot water shoots out of the earth. Yellowstone has more than three hundred geysers.

The most famous one is Old Faithful. It erupts about every ninety minutes, so visitors can plan a time to see it. Winters are very cold, but some areas stay open all year.`,
[['national park','parque nacional'],['geyser','gêiser'],['volcano','vulcão'],['canyon','cânion'],['wild animals','animais selvagens'],['to erupt','entrar em erupção']],
[['Foi o primeiro parque nacional do mundo, em 1872',['first','1872','national park']],['Fica no oeste dos Estados Unidos, em Wyoming',['wyoming','western','united states']],['Está sobre um vulcão e a terra é quente',['volcano','hot','heat','under']],['Tem mais de 300 gêiseres, e o mais famoso é o Old Faithful',['300','three hundred','geyser','old faithful']],['Ele entra em erupção a cada 90 minutos, e o inverno é frio',['90','ninety','minutes','cold','winter','open']]]),
H('s13','travel','B1',"A President's Country House",
`About five kilometers from the White House stands a small country house linked to President Abraham Lincoln. He spent about one quarter of his time as president there.

Summers in Washington, D.C., can be very hot. The house was on higher ground, so the wind kept it cooler, and it was quiet, a good place to think. Lincoln rode there on horseback every evening and returned in the morning.

He did a lot of writing at the cottage, including early versions of the Emancipation Proclamation, an important document from the Civil War. Soldiers lived nearby to protect him. At first Lincoln did not want them, but later he enjoyed talking with them. Much of what historians know about his time there comes from their stories.`,
[['cottage','casa de campo'],['on horseback','a cavalo'],['document','documento'],['soldier','soldado'],['historian','historiador'],['to protect','proteger']],
[['A casa fica a uns 5 km da Casa Branca',['five','kilometers','white house']],['Era mais fresca e silenciosa, ideal para fugir do calor',['hot','heat','cooler','quiet','wind']],['Lincoln ia e voltava a cavalo',['horse','rode']],['Ele escreveu ali versões da Proclamação de Emancipação',['writ','emancipation','document']],['Soldados o protegiam e contaram histórias aos historiadores',['soldier','protect','stories','historian']]]),
H('s14','travel','B1','The First Airplane',
`Wilbur and Orville Wright were two American brothers who loved mechanical things. They studied kites, bicycles, and a toy helicopter to get ideas for a flying machine.

They needed a place with strong, steady wind, so they chose Kitty Hawk, a sandy area on the coast of North Carolina. They tested gliders there and learned how to solve many problems.

On December 17, 1903, they made the first flight in a machine that was heavier than air and had an engine. Orville flew thirty-six meters and stayed in the air for twelve seconds. The brothers made three more flights that day. Only a few people watched, and few newspapers wrote about it.`,
[['brothers','irmãos'],['kite','pipa'],['glider','planador'],['engine','motor'],['flight','voo'],['wind','vento']],
[['Os irmãos tiraram ideias de pipas, bicicletas e um helicóptero de brinquedo',['brothers','kite','bicycle','helicopter']],['Escolheram Kitty Hawk pelo vento',['kitty hawk','north carolina','wind','sandy']],['Testaram planadores',['glider','test']],['O primeiro voo com motor foi em 17 de dezembro de 1903',['1903','december','first flight','engine']],['Orville voou 36 metros em 12 segundos',['36','thirty-six','12','twelve']]]),
H('s15','travel','A2','Talking About Your Holidays',
`Imagine you meet an American after the holidays. How can you start a conversation?

Begin with a yes-or-no question using the helping verb "do," for example: "Did you travel for the holidays?" If the answer is yes, ask a more open question. Open questions do not have a yes-or-no answer. A common structure is: What + did + you + do? For example: "What did you do for New Year's?"

Notice that the verb "do" appears twice. The first "did" helps make the question. The second "do" is the real action. Good wishes at this time of year are "Merry Christmas" and "Happy New Year!"`,
[['holidays','festas de fim de ano'],['helping verb','verbo auxiliar'],['open question','pergunta aberta'],['to celebrate','comemorar'],['to travel','viajar'],['good wishes','votos, felicitações']],
[['Comece com uma pergunta de sim ou não com "do"',['yes','no','question','do']],['Perguntas abertas não têm resposta de sim ou não',['open','not']],['Estrutura: what + did + you + do',['what','did','you','do']],['O verbo "do" aparece duas vezes',['twice','two','appears']],['Votos: Merry Christmas e Happy New Year',['merry christmas','happy new year']]]),
H('s16','travel','B1','Asking Better Questions',
`Suzanne Meyer teaches English at a university in Tennessee. She says many students need to improve their critical thinking: they should collect information, judge it, and use it in new situations.

One way to practice is to learn to ask good questions. Questions are often the first contact in a conversation, so a poor question limits the conversation, but a good question opens it up.

She says that question-asking helps English learners in many ways. Students become more active in class and more creative, and they get better at understanding answers. For travelers and workers, this is useful too: a clear question can help you find directions, solve a problem, or start a conversation.`,
[['critical thinking','pensamento crítico'],['to collect','reunir'],['to judge','avaliar'],['first contact','primeiro contato'],['creative','criativo'],['conversation','conversa']],
[['Meyer ensina inglês em uma universidade no Tennessee',['meyer','tennessee','teach','university']],['Os alunos precisam de pensamento crítico',['critical','think','collect','information']],['Uma forma de praticar é aprender a fazer boas perguntas',['ask','question','good']],['A pergunta costuma ser o primeiro contato na conversa',['first','conversation','contact']],['Os benefícios: mais ativos, criativos e melhores em entender respostas',['benefit','better','active','creative','understand']]])
];
