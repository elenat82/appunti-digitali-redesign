# Analisi UX/UI

Questo documento descrive le scelte UX/UI previste per la nuova versione di **Appunti Digitali**, una knowledge base personale pubblica dedicata alla programmazione web.

L'analisi UX/UI traduce requisiti e analisi funzionale in scelte di esperienza utente, struttura dell'interfaccia, priorità visiva, stati dell'interfaccia e modalità di interazione.

Le scelte grafiche di dettaglio, come colori, font, spaziature, stile dei componenti e aspetto dei blocchi di codice, saranno definite nel documento dedicato al design system.

## Scopo del documento

Lo scopo di questo documento è definire come l'utente deve poter usare il sito in modo chiaro, rapido e prevedibile.

In particolare, il documento descrive:

- struttura generale dell'interfaccia;
- comportamento della home page;
- comportamento della ricerca globale;
- visualizzazione dei risultati per occorrenze;
- consultazione degli articoli;
- orientamento per nuovi visitatori;
- sezioni informative della home page;
- profilo pubblico e contatti;
- comportamento del footer;
- accessibilità;
- responsive design;
- funzionalità rimosse dall'interfaccia.

## Principi UX

La nuova interfaccia deve rispettare alcuni principi principali.

### Ricerca come interazione primaria

La ricerca è il punto centrale dell'esperienza utente.

Il sito non deve obbligare l'utente a navigare manualmente una lunga lista di contenuti per trovare un'informazione. L'utente deve poter partire da una parola chiave e arrivare rapidamente al punto esatto dell'articolo in cui quella parola compare.

### Riduzione dei passaggi

L'interfaccia deve ridurre il numero di azioni necessarie per trovare un'informazione.

Il flusso ideale è:

1. l'utente digita una parola chiave;
2. il sistema mostra le occorrenze trovate;
3. l'utente seleziona l'occorrenza utile;
4. il sistema apre l'articolo nel punto corretto;
5. il termine cercato rimane evidenziato.

### Chiarezza per i nuovi visitatori

Il sito viene usato principalmente dall'amministratore, ma deve essere comprensibile anche per un visitatore che arriva per la prima volta.

Un nuovo utente deve capire rapidamente quali argomenti sono presenti nel sito, senza dover scorrere tutta la lista degli articoli.

### Densità controllata

Il sito contiene molti contenuti tecnici. L'interfaccia può essere densa, ma non deve diventare confusa.

La densità informativa deve essere utile alla consultazione, non decorativa.

### Leggibilità tecnica

Gli articoli devono essere comodi da leggere, soprattutto su desktop.

Il codice deve essere leggibile, riconoscibile e facilmente copiabile.

### Coerenza

Elementi simili devono comportarsi nello stesso modo.

Per esempio:

- i link esterni devono essere riconoscibili;
- i pulsanti di copia devono avere comportamento coerente;
- i risultati di ricerca devono avere una struttura ripetibile;
- le sezioni della home page devono avere una gerarchia visiva chiara.

### Accessibilità

L'accessibilità deve essere considerata parte integrante dell'esperienza utente, non un'aggiunta successiva.

L'interfaccia deve poter essere usata da tastiera, deve avere stati di focus visibili e deve evitare animazioni non necessarie.

## Utenti e contesti d'uso

### Amministratore

L'amministratore è l'utente principale del sito.

Usa Appunti Digitali come strumento quotidiano per:

- cercare appunti tecnici;
- recuperare rapidamente comandi;
- consultare esempi di codice;
- studiare argomenti legati allo sviluppo web;
- prepararsi a colloqui, certificazioni o attività pratiche;
- salvare e ritrovare risorse esterne.

L'amministratore usa il sito prevalentemente da desktop, in contesto di lavoro o studio.

### Utente anonimo

L'utente anonimo rappresenta un visitatore pubblico, per esempio:

- recruiter;
- sviluppatore;
- collega;
- persona arrivata da motore di ricerca;
- persona interessata a uno specifico argomento tecnico.

L'utente anonimo potrebbe non conoscere la struttura del sito e potrebbe non sapere quali aree tematiche sono presenti.

Per questo motivo l'interfaccia deve rendere visibili fin da subito gli argomenti trattati.

## Problemi della versione attuale

La versione attuale presenta alcuni limiti di esperienza utente.

### Ricerca basata sugli articoli, non sulle occorrenze

La ricerca filtra gli articoli per parola chiave, ma non mostra le diverse occorrenze della parola all'interno degli articoli.

L'utente riesce a trovare l'articolo, ma non sempre riesce a individuare rapidamente il punto utile.

### Necessità di usare la ricerca del browser

Dopo aver aperto un articolo, l'utente deve spesso usare manualmente la ricerca del browser per trovare la parola cercata all'interno della pagina.

Questo crea un passaggio aggiuntivo e interrompe il flusso di consultazione.

### Lista articoli lunga

La lista degli articoli può essere molto lunga.

Un nuovo visitatore che vede solo i primi articoli potrebbe pensare che il sito tratti soltanto gli argomenti visibili nella prima parte della lista.

Per esempio, se i primi articoli sono relativi ad HTML, un utente interessato a Drupal potrebbe lasciare il sito senza capire che sono presenti anche contenuti Drupal.

### Orientamento iniziale insufficiente

La home page non rende immediatamente evidenti tutte le aree tematiche presenti nel sito.

Questo è un problema soprattutto per gli utenti anonimi, che non conoscono già il contenuto della knowledge base.

## Obiettivi della nuova interfaccia

La nuova interfaccia deve:

- rendere la ricerca immediatamente disponibile;
- mostrare risultati basati su occorrenze;
- permettere di aprire direttamente il punto corretto dell'articolo;
- mantenere evidenziato il termine cercato;
- rendere visibili le aree tematiche presenti nel sito;
- permettere una consultazione comoda degli articoli lunghi;
- rendere il codice facilmente leggibile e copiabile;
- presentare in home page risorse esterne utili;
- mantenere chiari i contatti professionali dell'amministratore;
- evitare funzionalità non necessarie o non usate.

## Struttura generale dell'interfaccia

Nella versione desktop l'interfaccia pubblica è organizzata in quattro aree principali:

- pannello laterale di navigazione;
- header;
- area principale di contenuto;
- footer.

Il pannello laterale è dedicato alla navigazione per aree tematiche e articoli.

L'header contiene l'identità del sito e la ricerca globale.

L'area principale cambia contenuto in base allo stato dell'interfaccia e può mostrare:

- la home page;
- un articolo;
- l'overlay dei risultati di ricerca.

Il footer contiene informazioni secondarie e le azioni associate all'indirizzo email pubblico.

Questa struttura deve rimanere coerente durante la navigazione, in modo che ricerca e accesso agli argomenti rimangano prevedibili.

## Pannello laterale di navigazione

Il pannello laterale rappresenta la modalità principale di esplorazione dei contenuti per area tematica.

Nello stato espanso mostra il logo del sito e l'elenco completo delle aree tematiche. Ogni area può essere espansa per mostrare gli articoli appartenenti a quell'argomento.

Il pannello può essere collassato quando l'utente desidera lasciare maggiore spazio al contenuto principale.

Nello stato collassato:

- il logo non è necessario, perché l'identità "Appunti Digitali" rimane visibile nell'header;
- le etichette testuali delle aree vengono nascoste;
- rimangono visibili le icone delle aree tematiche;
- l'area tematica dell'articolo corrente rimane evidenziata.

Ogni icona deve avere un nome accessibile. Al passaggio del mouse e al focus da tastiera deve comparire un tooltip con il nome dell'area.

L'area interattiva associata all'icona deve essere più ampia dell'icona stessa, in modo da garantire un target facile da selezionare.

L'apertura e la chiusura del pannello devono essere accompagnate dai feedback sonori descritti nella sezione dedicata.

Su dispositivi mobili il pannello laterale deve essere presentato come drawer sovrapposto al contenuto della pagina.

Quando il drawer è aperto:

- il contenuto sottostante deve essere oscurato tramite backdrop e non deve essere interagibile;
- deve essere disponibile un controllo visibile e accessibile per chiudere il pannello;
- il tap o click sul backdrop può chiudere il pannello, ma non deve essere l'unico metodo disponibile;
- l'interazione deve rimanere accessibile anche quando il dispositivo viene utilizzato tramite tastiera o tecnologie assistive;
- dopo la chiusura, il contesto di interazione deve tornare al controllo che ha aperto il drawer.

Il controllo che apre il drawer deve comunicare in modo accessibile lo stato aperto o chiuso del pannello.

## Home page

La home page deve permettere all'utente di comprendere immediatamente la natura del sito e accedere rapidamente alle sue funzioni principali.

Nella versione desktop contiene:

- header con titolo del sito e ricerca globale;
- pannello laterale con le aree tematiche;
- sezione di presentazione professionale dell'amministratore con contatti e download del CV;
- sezione Notizie;
- sezione Stack Overflow;
- sezione GitHub starred;
- sezione Risorse salvate;
- footer.

La ricerca globale deve mantenere una posizione predominante e deve essere accessibile dall'header.

Le aree tematiche non devono essere duplicate nell'area principale della home, perché sono già immediatamente visibili nel pannello laterale.

## Orientamento per nuovi visitatori

Il pannello laterale deve consentire a un nuovo visitatore di comprendere rapidamente quali aree tematiche sono presenti nel sito.

A differenza della versione precedente, la nuova interfaccia non mostra inizialmente la lunga lista completa degli articoli. Mostra invece tutte le aree tematiche in forma compatta, lasciando all'utente la possibilità di espandere soltanto quelle che desidera esplorare.

In questo modo HTML, CSS, JavaScript, Angular, PHP, Drupal e Varie rimangono immediatamente visibili anche quando alcune aree contengono molti articoli.

Questa modalità di orientamento è complementare alla ricerca globale e non introduce una navigazione gerarchica complessa.


## Feedback sonoro

L'apertura e la chiusura del pannello laterale utilizzano brevi feedback sonori distinti, mantenendo una caratteristica già presente nella versione precedente del sito.

I suoni devono essere:

- brevi;
- discreti;
- chiaramente associati all'azione eseguita;
- riprodotti solo dopo un'interazione dell'utente;
- complementari al feedback visivo e non sostitutivi di esso.

Il pannello deve rimanere completamente comprensibile e utilizzabile anche con l'audio disattivato.

## Ricerca globale

La ricerca globale deve essere disponibile da qualunque pagina.

Il campo di ricerca deve essere facilmente individuabile e deve comunicare chiaramente che la ricerca riguarda tutti i contenuti pubblicati del sito.

La ricerca deve aggiornare i risultati durante la digitazione.

Per evitare risultati troppo rumorosi, l'interfaccia può prevedere uno stato iniziale prima dell'avvio effettivo della ricerca. Per esempio, il sistema può invitare l'utente a inserire una parola più specifica quando la query è troppo breve o troppo generica.

La soglia esatta di avvio della ricerca non viene fissata in questo documento. Sarà valutata in seguito, tenendo conto dei termini tecnici brevi che potrebbero comunque essere utili.

L'interfaccia deve gestire almeno questi stati:

- campo vuoto;
- query troppo breve o troppo generica;
- ricerca attiva;
- risultati trovati;
- nessun risultato;
- errore nel caricamento dei contenuti necessari alla ricerca.

## Presentazione dei risultati di ricerca

Quando l'utente inserisce una query valida, i risultati devono essere mostrati in un overlay opaco che copre l'area principale della pagina.

Nella versione desktop l'overlay lascia visibili l'header e il pannello laterale di navigazione. Su mobile occupa l'area disponibile sotto l'header, mentre il drawer di navigazione rimane normalmente chiuso.

L'overlay deve permettere all'utente di concentrarsi sui risultati senza essere disturbato dal contenuto sottostante.

Nella parte iniziale devono essere mostrati:

- la query cercata;
- il numero complessivo di occorrenze trovate;
- il numero di articoli nei quali sono state trovate.

I risultati devono essere raggruppati per articolo.

Per ogni articolo devono essere mostrati:

- l'area tematica, rappresentata tramite la relativa icona;
- il titolo dell'articolo;
- tutte le occorrenze rilevanti della query.

Ogni occorrenza deve mostrare uno snippet del contenuto in cui compare il termine cercato e deve evidenziare visivamente il termine.

Ogni occorrenza deve essere selezionabile autonomamente.

Non è necessario indicare se l'occorrenza proviene da titolo, paragrafo, codice, lista o tabella, perché questa informazione non è necessaria per individuare rapidamente il risultato utile.

## Apertura di un risultato di ricerca

Quando l'utente seleziona un'occorrenza, l'overlay dei risultati deve chiudersi e il sistema deve aprire l'articolo corrispondente direttamente nel punto in cui si trova l'occorrenza selezionata.

La query deve rimanere visibile nella barra di ricerca e il termine cercato deve rimanere evidenziato nell'articolo.

Quando l'articolo è stato aperto a partire da una ricerca, l'interfaccia deve mostrare l'azione "Torna ai risultati", che consente di riaprire l'overlay mantenendo la ricerca precedente.

L'utente deve poter capire visivamente quale punto dell'articolo è stato raggiunto.

L'interfaccia deve evitare spostamenti inattesi o disorientanti. Se viene usato uno scroll automatico, il comportamento deve essere prevedibile e non eccessivamente animato.

## Pagina articolo

La pagina del singolo articolo deve favorire la lettura di contenuti tecnici anche lunghi.

L'articolo deve rendere riconoscibili:

- titolo principale;
- sottotitoli;
- paragrafi;
- liste;
- tabelle;
- blocchi di codice;
- comandi;
- link di approfondimento;
- eventuali immagini informative.

Le immagini, quando presenti, devono avere funzione informativa e non decorativa.

La pagina articolo non deve obbligare l'utente a usare un indice laterale.

Gli articoli lunghi devono rimanere consultabili in un'unica pagina, perché il contenuto correlato allo stesso argomento deve rimanere insieme.

## Blocchi di codice

I blocchi di codice devono essere riconoscibili visivamente rispetto al testo normale.

Quando il linguaggio del blocco è noto, il blocco deve mostrare un'etichetta sintetica, per esempio `PHP`, `YAML`, `TypeScript` o `Bash`, per aiutare l'utente a riconoscere immediatamente il contesto dello snippet.

I frammenti tecnici inline non devono invece mostrare un'etichetta del linguaggio, perché interromperebbe inutilmente il flusso di lettura.

Ogni blocco di codice deve includere un controllo che permetta di copiarne rapidamente il contenuto.

Il pulsante di copia deve essere visibile o facilmente raggiungibile, ma non deve disturbare la lettura.

Dopo la copia, l'interfaccia deve fornire un feedback chiaro, per esempio confermando che il contenuto è stato copiato.

I comandi devono essere copiabili quando sono riconoscibili come blocchi o righe di codice.

Su schermi piccoli, il codice deve rimanere consultabile. La soluzione preferibile sarà valutata in fase di design, evitando di nascondere contenuti potenzialmente utili.

## Accessibilità dei blocchi di codice

Poiché gli articoli di Appunti Digitali contengono molti snippet e comandi, i blocchi di codice devono essere progettati come elementi centrali dell'esperienza utente.

Il codice deve rimanere testo selezionabile, copiabile e ricercabile. Non devono essere usate immagini o screenshot per rappresentare codice, salvo casi eccezionali in cui l'immagine abbia una funzione esplicativa diversa dal codice stesso.

I blocchi di codice devono essere riconoscibili rispetto al testo normale e devono mantenere una buona leggibilità anche quando contengono righe lunghe, indentazione o caratteri speciali.

Il syntax highlighting deve migliorare la leggibilità, ma non deve essere l'unico elemento che permette di comprendere il codice. I colori usati per il codice dovranno garantire contrasto adeguato e saranno definiti nel design system.

Ogni blocco di codice deve poter essere copiato tramite un controllo accessibile. Il controllo di copia deve essere raggiungibile da tastiera, avere uno stato di focus visibile e fornire un feedback comprensibile dopo l'azione.

L'interfaccia deve evitare di rendere focusabili elementi non necessari all'interno del blocco di codice. In particolare, non devono diventare focusabili le singole righe di codice, mentre devono esserlo eventuali controlli interattivi come il pulsante di copia.

Se vengono mostrati numeri di riga, questi devono essere progettati in modo da non disturbare la lettura del codice da parte delle tecnologie assistive.

Su schermi piccoli, i blocchi di codice non devono essere rimossi o resi irraggiungibili. La soluzione responsive dovrà permettere di consultare e copiare il codice anche da mobile, evitando tagli del contenuto o comportamenti non utilizzabili da tastiera.

Quando l'utente arriva a un blocco di codice tramite un risultato di ricerca, il termine cercato deve rimanere evidenziato senza compromettere la leggibilità del codice.

## Codice e frammenti tecnici inline

Gli articoli devono supportare anche frammenti tecnici inline, cioè brevi elementi tecnici inseriti direttamente nel flusso del testo.

I frammenti inline devono essere distinguibili dal testo normale, ma non devono avere lo stesso peso visivo dei blocchi di codice.

Devono aiutare l'utente a riconoscere rapidamente termini tecnici, nomi di file, chiavi di configurazione, comandi brevi o sintassi, senza interrompere la lettura del paragrafo.

A differenza dei blocchi di codice, i frammenti inline non devono mostrare un’etichetta del linguaggio e non devono avere un pulsante di copia dedicato.

Il loro aspetto visivo sarà definito nel design system, prestando attenzione a contrasto, leggibilità e coerenza con i blocchi di codice.

## Esempi di codice interattivi

Gli embed CodePen devono essere percepiti come dimostrazioni interattive e non come normali blocchi di codice.

Devono integrarsi visivamente con l'articolo senza interrompere eccessivamente il flusso di lettura e devono rimanere utilizzabili anche quando mostrano contemporaneamente codice e risultato.

Quando disponibile, l'interfaccia può privilegiare un caricamento su richiesta dell'embed, soprattutto negli articoli che contengono molte demo interattive, per evitare di appesantire inutilmente la pagina.

Deve essere sempre disponibile un collegamento alla demo originale qualora il contenuto incorporato non possa essere visualizzato.

La resa su schermi piccoli deve essere valutata separatamente, perché la visualizzazione contemporanea di editor e risultato può richiedere più spazio rispetto a un normale blocco di codice.

Il contenuto interno degli embed CodePen non deve generare risultati di ricerca, per evitare occorrenze duplicate rispetto ai blocchi di codice statici presenti nell'articolo.

## Link di approfondimento

I link di approfondimento sono parte del contenuto utile dell'articolo.

L'interfaccia deve prevedere due possibili modalità di presentazione:

- link associati all'intero articolo;
- link associati a una sezione o a un paragrafo specifico.

I link associati all'intero articolo possono essere mostrati in un'area dedicata.

I link collegati a una porzione specifica del contenuto possono essere mostrati vicino al testo di riferimento, per esempio come elementi compatti alla fine del paragrafo.

La scelta definitiva sulla resa visiva dei link verrà definita nel design system.

## Tabelle e informazioni di compatibilità

Quando un articolo tratta una funzionalità il cui supporto varia tra browser o ambienti, può essere utile mostrare informazioni di compatibilità vicino alla spiegazione.

Gli embed di compatibilità devono essere usati solo quando aiutano realmente l'utente a prendere una decisione o a comprendere i limiti della funzionalità.

Non devono appesantire visivamente l'articolo quando l'informazione di compatibilità è marginale.

Quando possibile, deve essere disponibile anche un collegamento alla fonte originale.

## Sezioni informative della home page

Le sezioni informative della home page devono offrire risorse esterne utili senza togliere centralità alla ricerca.

Le sezioni previste sono:

- notizie da feed RSS;
- ultime domande Stack Overflow;
- repository GitHub starred;
- risorse salvate tramite web clipper.

Gli elementi di queste sezioni devono essere presentati come link verso risorse esterne o interne, a seconda del tipo di contenuto.

Quando un link porta fuori dal sito, l'interfaccia deve renderlo comprensibile all'utente.

L'apertura in una nuova scheda può essere usata per consentire la consultazione della risorsa esterna senza abbandonare Appunti Digitali.

## Notizie da feed RSS

La sezione dedicata ai feed RSS deve mostrare notizie provenienti da fonti selezionate.

Ogni notizia dovrebbe mostrare almeno:

- titolo;
- fonte;
- data.

L'obiettivo della sezione è offrire aggiornamenti tecnici consultabili rapidamente.

Le notizie non devono diventare il contenuto principale della home page.

## Ultime domande Stack Overflow

La sezione dedicata a Stack Overflow deve mostrare domande recenti relative agli argomenti trattati dal sito.

Ogni domanda dovrebbe mostrare almeno:

- titolo;
- eventuali tag, se utili alla comprensione;
- collegamento alla domanda originale.

I tag possono aiutare a capire rapidamente l'argomento della domanda, ma non devono appesantire la sezione.

## Repository GitHub starred

La sezione dedicata ai repository GitHub starred deve mostrare repository selezionati dall'amministratore.

Ogni repository dovrebbe mostrare almeno:

- nome del repository;
- eventuale descrizione breve, se disponibile;
- collegamento al repository originale.

La sezione deve aiutare a valorizzare risorse tecniche utili, senza diventare una replica completa di GitHub.

Eventuali funzioni di filtro o ricerca interna ai repository starred non fanno parte delle decisioni UX principali e potranno essere valutate solo se necessarie.

## Risorse salvate tramite web clipper

La sezione dedicata alle risorse salvate tramite web clipper deve mostrare link selezionati dall'amministratore.

Ogni risorsa salvata deve mostrare almeno:

- titolo;
- URL o dominio;
- tag associato.

Il tag serve a dare un contesto minimo alla risorsa salvata, ma non deve trasformarsi in un sistema generale di classificazione degli articoli tecnici.

La sezione deve permettere di recuperare rapidamente link utili salvati durante la navigazione.

## Profilo pubblico e contatti

La home page deve mostrare una sezione dedicata alla presentazione professionale e ai contatti dell'amministratore.

La sezione contatti deve mostrare informazioni pubbliche dell'amministratore, per esempio:

- breve presentazione;
- indirizzo email;
- link LinkedIn;
- link GitHub;
- pulsante per scaricare il CV.

Il numero di telefono può essere valutato come informazione opzionale, solo se si decide consapevolmente di renderlo pubblico.

Il pulsante per scaricare il CV deve essere facilmente riconoscibile.

## Footer e azioni email

Il footer deve mostrare l'indirizzo email pubblico dell'amministratore.

Quando l'utente seleziona l'indirizzo email, l'interfaccia deve offrire almeno due azioni:

- aprire il client email tramite link `mailto:`;
- copiare l'indirizzo email negli appunti.

Le due azioni devono essere chiaramente distinguibili.

Dopo la copia dell'indirizzo email, l'interfaccia deve fornire un feedback di conferma.

## Accessibilità UX

L'interfaccia deve essere progettata tenendo conto dell'accessibilità.

In particolare:

- tutti gli elementi interattivi devono essere raggiungibili da tastiera;
- lo stato di focus deve essere visibile;
- i link devono essere distinguibili dal testo normale;
- i pulsanti devono avere etichette comprensibili;
- i pannelli sovrapposti devono gestire correttamente focus, chiusura e interazione con il contenuto sottostante;
- l'apertura di link esterni deve essere comunicata in modo chiaro;
- i feedback di copia devono essere comprensibili;
- le animazioni non necessarie devono essere evitate;
- eventuali animazioni devono rispettare le preferenze dell'utente sulla riduzione del movimento.

L'accessibilità non deve essere trattata come una funzionalità separata, ma come criterio trasversale a tutta l'interfaccia.

## Responsive design

Il sito sarà usato principalmente da desktop, perché la consultazione avviene soprattutto in contesti di lavoro, studio e sviluppo.

Il layout desktop deve quindi essere particolarmente curato.

Il sito deve comunque essere responsive e consultabile anche da dispositivi mobili.

Su schermi piccoli l'interfaccia deve:

- mantenere accessibile la ricerca globale;
- non rendere impossibile la lettura degli articoli;
- gestire correttamente blocchi di codice e tabelle;
- evitare sovrapposizioni tra sidebar, risultati e contenuto;
- rendere utilizzabili pulsanti, link, drawer e altri pannelli sovrapposti.

I blocchi di codice non devono essere rimossi su mobile. Potranno essere gestiti con soluzioni dedicate, per esempio scorrimento orizzontale, visualizzazione compatta o apertura controllata, da definire nel design system.

## Funzionalità rimosse dalla UI

La nuova interfaccia non deve riproporre alcune funzionalità presenti o ipotizzabili nella versione precedente.

### Contenuti correlati manuali

La sezione dei contenuti correlati manuali non verrà mostrata.

Questa scelta riduce manutenzione e complessità, perché la consultazione reale del sito avviene principalmente tramite ricerca.

### Sezione "Strumenti utili"

La sezione separata "Strumenti utili" non verrà mantenuta.

Eventuali link utili potranno essere gestiti come risorse salvate tramite web clipper.

### Breadcrumb

Non è previsto l'uso di breadcrumb, perché il sito non adotta una struttura di navigazione profonda.

### Indice laterale obbligatorio dell'articolo

Non è previsto un indice laterale obbligatorio per gli articoli.

Gli articoli lunghi devono rimanere leggibili, ma la navigazione principale deve continuare a basarsi sulla ricerca.

### Dark mode

La dark mode non è prevista.

L'interfaccia deve privilegiare una modalità chiara, leggibile e coerente con l'identità visiva del sito.

## Decisioni aperte

Le seguenti decisioni saranno approfondite nelle fasi successive.

### Soglia di avvio della ricerca

La ricerca non dovrebbe produrre risultati inutilmente rumorosi fin dalla prima lettera digitata.

Resta da definire se introdurre una soglia minima di caratteri o un messaggio per query troppo generiche.

La decisione dovrà tenere conto anche di termini tecnici brevi.

### Presentazione dei link di approfondimento

Resta da definire come distinguere visivamente:

- link associati all'intero articolo;
- link associati a un paragrafo o a una sezione specifica.

### Gestione mobile dei blocchi di codice

Resta da definire la soluzione migliore per rendere i blocchi di codice leggibili e copiabili anche su schermi piccoli.

### Metadati aggiuntivi delle sezioni informative

Resta da definire quali eventuali metadati aggiuntivi mostrare per:

- notizie RSS;
- domande Stack Overflow;
- repository GitHub starred;
- risorse salvate.

La decisione dovrà bilanciare utilità, leggibilità e densità informativa.

### Uso delle liste GitHub starred

GitHub consente di organizzare i repository starred in liste pubbliche.

Resta da valutare se usare questa funzionalità per organizzare i repository mostrati nella home page di Appunti Digitali.

L'uso delle liste potrebbe essere utile per raggruppare i repository per argomento, per esempio Drupal, Angular, CSS, accessibilità o strumenti di sviluppo.

La decisione non viene fissata in questa fase, perché occorre prima verificare se le liste sono effettivamente utili al modo in cui l'amministratore seleziona e consulta i repository starred.

### Esempi interattivi per altre tecnologie

Oltre agli embed CodePen, si valuterà l'utilizzo di servizi che consentano di mostrare esempi interattivi anche per tecnologie non supportate da CodePen.

In particolare, verrà valutato StackBlitz per gli esempi Angular e un playground PHP embeddabile per gli esempi PHP.

L'obiettivo è mantenere, dove tecnicamente appropriato, lo stesso principio degli esempi CodePen: permettere all'utente di osservare sia il codice sia il relativo risultato senza abbandonare l'articolo.

Per Drupal non viene al momento individuata una soluzione equivalente sufficientemente semplice e affidabile; eventuali demo interattive saranno valutate separatamente.
