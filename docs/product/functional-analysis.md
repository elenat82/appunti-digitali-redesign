# Analisi funzionale

Questo documento descrive il comportamento funzionale previsto per la nuova versione di **Appunti Digitali**, una knowledge base personale pubblica dedicata alla programmazione web.

L'analisi funzionale parte dai requisiti del progetto e descrive come il sistema deve comportarsi dal punto di vista degli utenti, senza entrare nel dettaglio delle scelte tecniche o grafiche.

## Scopo del sistema

Appunti Digitali deve consentire la consultazione rapida di contenuti tecnici relativi alla programmazione web.

Il sito deve funzionare come uno strumento quotidiano per:

- cercare velocemente informazioni tecniche;
- consultare appunti, esempi di codice, comandi e spiegazioni teoriche;
- recuperare link esterni di approfondimento;
- accedere a notizie e risorse collegate agli argomenti trattati;
- mostrare pubblicamente competenze e metodo progettuale.

La priorità funzionale principale è la **ricercabilità delle informazioni**. Il sistema deve permettere all'utente di trovare rapidamente non solo l'articolo che contiene una parola chiave, ma anche la specifica occorrenza della parola all'interno dell'articolo.

## Utenti del sistema

### Utente anonimo

L'utente anonimo rappresenta qualunque visitatore pubblico del sito.

Può:

- consultare i contenuti pubblicati;
- usare la ricerca globale;
- aprire gli articoli;
- leggere gli snippet di codice;
- copiare blocchi di codice o comandi;
- consultare link esterni di approfondimento;
- visualizzare le sezioni della home page;
- visualizzare la sezione contatti;
- scaricare il CV dell'amministratore;
- usare le azioni disponibili sull'indirizzo email pubblico.

Non può:

- accedere al backend;
- creare contenuti;
- modificare contenuti;
- commentare;
- registrarsi;
- accedere a contenuti non pubblicati.

### Utente amministratore

L'utente amministratore è l'unico utente autenticato previsto dal sistema.

Può:

- accedere al backend Drupal;
- creare nuovi contenuti;
- modificare contenuti esistenti;
- eliminare contenuti;
- pubblicare o non pubblicare contenuti;
- gestire le aree tematiche;
- gestire i link esterni di approfondimento;
- gestire i termini di tassonomia usati dalle risorse salvate;
- aggiornare le informazioni pubbliche del profilo;
- aggiornare il file CV;
- usare il web clipper per salvare nuove risorse.

## Aree funzionali

Il sistema è composto dalle seguenti aree funzionali:

- consultazione dei contenuti tecnici;
- ricerca globale;
- visualizzazione dei risultati per occorrenze;
- apertura dell'articolo nel punto selezionato;
- consultazione degli approfondimenti;
- home page con sezioni informative;
- profilo pubblico e contatti;
- gestione contenuti tramite backend;
- salvataggio risorse tramite web clipper.

## Consultazione dei contenuti tecnici

Gli utenti anonimi possono consultare tutti i contenuti pubblicati.

I contenuti sono organizzati per area tematica. Le aree tematiche iniziali sono:

- HTML;
- CSS;
- JavaScript;
- Angular;
- PHP;
- Drupal;
- Varie.

Il sistema deve consentire l'aggiunta futura di nuove aree tematiche, per esempio Java, Flutter, SQL, Symfony, Ionic o UI/UX. Quando viene aggiunta una nuova area tematica, questa deve diventare disponibile nella navigazione pubblica e deve poter contenere articoli consultabili e ricercabili come quelli delle aree già esistenti.

Gli articoli possono essere lunghi e non devono essere suddivisi artificialmente in più pagine. La lunghezza dell'articolo non è considerata un problema funzionale, perché il sito è pensato per raccogliere in un'unica pagina informazioni correlate sullo stesso argomento.

Ogni articolo può contenere:

- testo;
- titoli e sottotitoli;
- liste;
- tabelle;
- snippet di codice;
- comandi;
- link esterni di approfondimento.

Il sistema deve visualizzare correttamente la struttura del contenuto, in particolare titoli, sottotitoli, paragrafi, liste, tabelle e blocchi di codice.

## Navigazione per aree tematiche

Oltre alla ricerca globale, il sistema deve consentire la navigazione diretta dei contenuti attraverso le aree tematiche.

Le aree tematiche devono essere sempre facilmente riconoscibili, in modo che un nuovo visitatore possa comprendere rapidamente quali argomenti sono trattati nel sito senza dover scorrere una lunga lista di articoli.

La navigazione laterale deve riflettere automaticamente l'insieme delle aree tematiche attualmente disponibili nel sistema.

L'ordine delle aree deve poter essere definito dall'amministratore e deve essere rispettato nella navigazione pubblica.

Le aree tematiche iniziali mostrate nella navigazione laterale sono:

- HTML;
- CSS;
- JavaScript;
- Angular;
- PHP;
- Drupal;
- Varie.

Ogni area può essere espansa per mostrare gli articoli appartenenti a quell'argomento.

La navigazione per aree tematiche è complementare alla ricerca globale:

- la ricerca è pensata per l'utente che vuole trovare rapidamente un'informazione specifica;
- la navigazione laterale è pensata per l'utente che vuole esplorare gli articoli disponibili in una determinata area.

Nella versione desktop, il pannello laterale può essere collassato per lasciare maggiore spazio al contenuto principale. Anche nello stato desktop collassato le diverse aree devono rimanere riconoscibili attraverso le rispettive icone e deve essere possibile identificare l'area dell'articolo attualmente visualizzato.

### Feedback sonoro

L'apertura e la chiusura del pannello laterale sono accompagnate da due brevi suoni distinti.

Il feedback sonoro ha lo scopo di rendere più riconoscibile e piacevole l'interazione, ma non deve essere necessario per comprendere lo stato del pannello.

L'interfaccia deve quindi comunicare chiaramente anche in modo visivo se il pannello è aperto o chiuso.

## Ricerca globale

La ricerca è l'interazione principale del sito.

L'utente deve poter eseguire una ricerca da qualunque pagina tramite una parola chiave.

La ricerca deve essere globale e deve considerare tutti i contenuti pubblicati.

La ricerca deve includere almeno:

- titolo del contenuto;
- body del contenuto;
- snippet di codice;
- tabelle;
- liste;
- link esterni di approfondimento o altri campi personalizzati rilevanti per la consultazione pubblica.

La ricerca deve supportare parole parziali e deve gestire correttamente termini tecnici e caratteri speciali.

Esempi di parole o espressioni ricercabili:

- `<div>`;
- `::before`;
- `for...of`;
- `toString`;
- `drush cr`;
- `composer install`;
- `services.yml`;
- `hook_theme`.

La ricerca deve aggiornare i risultati progressivamente durante la digitazione. Non deve essere necessario premere un pulsante di invio e non deve essere obbligatoria l'apertura di una pagina separata dedicata ai risultati.

Quando il campo di ricerca è vuoto, il sistema mostra il normale contenuto previsto per la pagina corrente.

Quando l'utente digita una parola chiave, il sistema mostra progressivamente i risultati corrispondenti.

## Risultati per occorrenze

La ricerca non deve restituire soltanto l'elenco degli articoli che contengono la parola cercata.

Il sistema deve restituire tutte le occorrenze trovate nei contenuti pubblicati.

Ogni occorrenza deve essere presentata come risultato autonomo e selezionabile.

Ogni risultato deve mostrare uno snippet del contenuto in cui compare la parola cercata. La parola cercata deve essere evidenziata nello snippet.

Le occorrenze devono essere raggruppate per articolo, ma senza nascondere occorrenze potenzialmente utili.

Il sistema non deve obbligare l'utente a distinguere i risultati in base alla posizione dell'occorrenza nel contenuto, per esempio titolo, sottotitolo, body, codice, lista o tabella.

Non è un requisito mostrare all'utente la sezione dell'articolo in cui si trova l'occorrenza.

La priorità della visualizzazione dei risultati è permettere all'utente di riconoscere velocemente lo snippet utile e aprire direttamente l'occorrenza desiderata.

## Apertura dell'articolo nel punto selezionato

L'utente deve poter scegliere manualmente quale occorrenza aprire.

Quando l'utente seleziona un'occorrenza, il sistema deve aprire l'articolo corrispondente e portare l'utente direttamente nel punto in cui quella occorrenza si trova.

Dopo l'apertura dell'articolo, il termine cercato deve rimanere evidenziato nel contenuto.

Questo comportamento sostituisce il flusso precedente in cui l'utente individuava l'articolo tramite ricerca e poi doveva usare manualmente la ricerca del browser all'interno della pagina.

Quando l'articolo viene aperto a partire da una ricerca, l'utente deve poter tornare ai risultati della ricerca precedente senza dover reinserire la query.

## Lettura degli articoli

La pagina articolo deve favorire la lettura comoda di contenuti tecnici, anche lunghi.

Il sistema deve dare particolare importanza a:

- leggibilità del testo;
- leggibilità degli snippet di codice;
- corretta visualizzazione di tabelle e liste;
- possibilità di copiare rapidamente blocchi di codice;
- possibilità di copiare rapidamente comandi;
- evidenziazione del termine cercato quando l'articolo viene aperto da un risultato di ricerca.

Il sistema deve applicare syntax highlighting agli snippet di codice.

I linguaggi e formati inizialmente supportati sono:

- HTML;
- CSS;
- JavaScript;
- TypeScript;
- PHP;
- Twig;
- YAML;
- JSON;
- SQL;
- Bash.

## Frammenti tecnici inline

Oltre ai blocchi di codice separati dal testo, gli articoli devono poter contenere brevi frammenti tecnici inline.

Questi frammenti servono quando un termine tecnico deve essere distinto dal testo normale senza creare un blocco di codice separato.

Esempi di frammenti tecnici inline sono:

- nomi di chiavi di configurazione, come `name`, `type` o `core_version_requirement`;
- nomi di file, come `.info.yml`;
- comandi brevi;
- nomi di funzioni, metodi o proprietà;
- selettori CSS;
- tag HTML;
- brevi esempi di sintassi.

I frammenti inline devono rimanere parte del flusso del paragrafo e devono essere ricercabili come il resto del contenuto.

Non devono avere necessariamente un pulsante di copia dedicato, perché la funzione di copia è prioritaria per i blocchi di codice e per i comandi separati.

## Esempi di codice interattivi

Oltre ai blocchi di codice statici e ai frammenti tecnici inline, gli articoli possono contenere esempi di codice interattivi.

Gli esempi interattivi sono utili quando la comprensione del contenuto beneficia della visualizzazione contemporanea del codice e del relativo risultato, per esempio per dimostrazioni HTML, CSS o JavaScript.

Nella prima release il servizio esterno utilizzato per questo tipo di contenuto è CodePen.

L'utente deve poter consultare la dimostrazione direttamente all'interno dell'articolo e deve poter raggiungere la risorsa originale qualora l'embed non sia disponibile.

Gli esempi CodePen non partecipano alla ricerca globale.

Il codice mostrato negli embed è generalmente già presente nello stesso articolo come blocco di codice statico e ricercabile. Escludere gli embed evita quindi la duplicazione delle occorrenze nei risultati di ricerca.

## Link esterni di approfondimento

Ogni articolo può avere link esterni di approfondimento.

I link di approfondimento possono riferirsi all'intero articolo oppure a uno specifico passaggio del contenuto.

Quando una fonte o una risorsa è strettamente collegata a una determinata spiegazione, il link deve poter essere inserito contestualmente a quel passaggio, senza essere obbligatoriamente separato dal testo in un elenco generale di approfondimenti.

I link di approfondimento fanno parte del contenuto utile alla consultazione e devono essere considerati nella ricerca.

Il sistema deve mostrare i link di approfondimento associati all'articolo in modo chiaro e facilmente consultabile.

Questa funzionalità viene mantenuta perché i link esterni, per esempio verso documentazione ufficiale o risorse tecniche autorevoli, sono parte del valore informativo dell'articolo.

## Contenuti esterni incorporati

Gli articoli possono contenere contenuti esterni incorporati quando questi aggiungono informazioni che sarebbe meno efficace riprodurre manualmente.

Gli embed possono avere finalità diverse, per esempio:

- mostrare una demo interattiva con codice e risultato;
- mostrare informazioni aggiornate sulla compatibilità di una funzionalità web.

Gli embed di compatibilità, come quelli forniti da Can I use, sono utili soprattutto per argomenti HTML, CSS, JavaScript e Web API.

Il loro utilizzo deve essere valutato caso per caso, evitando di inserire embed che non aggiungano un beneficio concreto alla consultazione dell'articolo.

## Home page

La home page deve dare priorità alla ricerca globale.

La prima release pubblica deve includere anche le sezioni previste per la home page:

- notizie provenienti da feed RSS selezionati;
- ultime domande Stack Overflow relative agli argomenti trattati dal sito;
- repository GitHub starred;
- risorse salvate tramite web clipper.

Il design della home page dovrà considerare fin dall'inizio tutte queste sezioni, anche se lo sviluppo potrà procedere per incrementi tecnici successivi.

La home page non deve essere progettata come un semplice elenco cronologico di articoli, perché la data di pubblicazione non è un criterio rilevante per l'uso del sito.

## Notizie da feed RSS

Il sistema deve mostrare una sezione dedicata alle notizie provenienti da feed RSS selezionati.

Questa sezione ha lo scopo di raccogliere aggiornamenti da fonti esterne legate agli argomenti del sito.

Le notizie devono essere presentate come contenuti consultabili rapidamente, senza diventare l'elemento principale della pagina.

## Ultime domande Stack Overflow

Il sistema deve mostrare una sezione dedicata alle ultime domande pubblicate su Stack Overflow relative agli argomenti trattati dal sito.

Questa sezione ha lo scopo di esporre problemi, dubbi e discussioni tecniche recenti collegate alle tecnologie presenti in Appunti Digitali.

Le domande devono essere presentate come risorse esterne e non come contenuti editoriali interni del sito.

## Repository GitHub starred

Il sistema deve mostrare una sezione dedicata ai repository GitHub starred.

Questa sezione ha lo scopo di rendere consultabili repository tecnici selezionati dall'amministratore tramite la funzionalità starred di GitHub.

I repository devono essere presentati come risorse esterne di interesse tecnico.

## Risorse salvate tramite web clipper

La home page deve mostrare una sezione dedicata ai link salvati tramite web clipper.

Le risorse salvate rappresentano pagine web esterne che l'amministratore ha scelto di conservare all'interno del sito.

Ogni risorsa salvata deve includere almeno:

- titolo della pagina;
- URL;
- tag associato.

I tag delle risorse salvate devono essere gestiti tramite tassonomia Drupal.

I tag usati per le risorse salvate non devono diventare un sistema generale di classificazione degli articoli tecnici.

## Web clipper

Il web clipper consente all'amministratore di salvare nel sito una pagina web esterna durante la navigazione.

Il flusso funzionale previsto è:

1. l'amministratore visita una pagina web;
2. l'amministratore attiva l'estensione Chrome;
3. l'estensione recupera almeno titolo e URL della pagina;
4. l'amministratore associa un tag alla risorsa;
5. il sistema salva la pagina come nuova risorsa in Drupal;
6. la risorsa salvata diventa disponibile nella relativa sezione del sito.

Il web clipper deve essere utilizzabile solo dall'amministratore. Gli utenti anonimi non devono poter creare risorse salvate.

## Profilo pubblico e contatti

La home page deve includere una sezione dedicata al profilo pubblico e ai contatti dell'amministratore.

La sezione contatti deve mostrare almeno una breve presentazione, le informazioni pubbliche dell'amministratore e l'avatar pubblico dell'amministratore, e deve consentire il download del CV.

Le informazioni mostrate nella sezione contatti non devono essere gestite come stringhe statiche nel frontend.

Il footer deve mostrare l'indirizzo email pubblico dell'amministratore.

Quando l'utente seleziona l'indirizzo email nel footer, il sistema deve offrire due azioni:

- apertura del client email tramite link `mailto:`;
- copia dell'indirizzo email negli appunti.

Questa funzionalità viene mantenuta perché supporta il valore pubblico e professionale del sito.

## Orientamento per nuovi visitatori

Oltre alla ricerca globale, il pannello laterale di navigazione deve aiutare i nuovi visitatori a comprendere rapidamente quali aree tematiche sono presenti nel sito.

Nella versione attuale, la lista degli articoli può essere molto lunga e un utente che visualizza solo i primi contenuti potrebbe non capire che il sito include anche argomenti collocati più avanti nella lista, per esempio Drupal, PHP o Angular.

La nuova versione deve quindi rendere visibili le aree tematiche disponibili fin dal primo accesso.

Questa funzionalità non deve trasformare il sito in una navigazione gerarchica complessa e non deve sostituire la ricerca globale. Deve funzionare come supporto all'orientamento iniziale e alla scoperta dei contenuti.

## Gestione dei contenuti

L'amministratore gestisce i contenuti tramite backend Drupal.

Dal backend deve poter:

- creare, modificare o eliminare contenuti;
- pubblicare o non pubblicare contenuti;
- gestire aree tematiche;
- gestire link esterni di approfondimento;
- gestire i tag delle risorse salvate;
- aggiornare le informazioni pubbliche del profilo;
- aggiornare il CV.

Gli utenti anonimi possono consultare solo i contenuti pubblicati.

## Migrazione dei contenuti

La nuova versione del sito deve includere i contenuti provenienti dall'attuale sito Drupal 8.

La migrazione deve preservare, dove possibile:

- titolo;
- body HTML;
- area tematica o content type;
- link di approfondimento;
- struttura dei blocchi di codice.

I contenuti migrati devono risultare consultabili e ricercabili nella nuova versione del sito.

## Funzionalità rimosse rispetto alla versione precedente

Alcune funzionalità presenti nella versione precedente non saranno mantenute nella nuova versione.

### Contenuti correlati manuali

La funzionalità di associazione manuale di contenuti correlati tra articoli viene rimossa.

Motivazione funzionale:

- non è stata utilizzata in modo significativo;
- aumenta il lavoro di inserimento e manutenzione;
- non corrisponde al modo reale di consultare il sito;
- la consultazione avviene principalmente tramite ricerca per parola chiave.

### Sezione "Strumenti utili"

La sezione separata "Strumenti utili" viene rimossa.

Motivazione funzionale:

- viene consultata raramente;
- occupa spazio nell'interfaccia;
- duplica parzialmente il concetto di risorsa esterna;
- eventuali link utili potranno essere gestiti in modo più coerente tramite le risorse salvate con web clipper.

## Funzionalità escluse

La nuova versione del sito non prevede:

- registrazione di utenti pubblici;
- login per visitatori;
- commenti;
- form di contatto pubblici;
- analytics;
- cookie di profilazione;
- preferiti;
- cronologia delle ricerche;
- ricerche salvate;
- filtri avanzati;
- tag per gli articoli tecnici;
- contenuti correlati manuali tra articoli;
- sezione separata "Strumenti utili";
- classificazione per difficoltà;
- classificazione per stato di aggiornamento;
- classificazione per versione;
- breadcrumb;
- indice laterale degli articoli;
- dark mode.

Queste esclusioni hanno lo scopo di mantenere il sistema concentrato sulle funzionalità realmente utili: ricerca, consultazione dei contenuti, lettura del codice, approfondimenti, contatti professionali e gestione di risorse esterne selezionate.
