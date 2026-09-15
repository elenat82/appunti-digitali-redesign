# Requisiti

Questo documento descrive i requisiti della nuova versione di **Appunti Digitali**, una knowledge base personale pubblica dedicata alla programmazione web.

Il sito ha tre obiettivi principali:

- fornire uno strumento quotidiano per consultare rapidamente appunti tecnici;
- valorizzare il progetto come portfolio pubblico;
- consentire lo studio e l'applicazione pratica di Drupal 11, Angular moderno, architettura decoupled, accessibilità, SEO e migrazione contenuti.

La priorità principale del progetto è la **ricercabilità delle informazioni**. Il sistema deve permettere di trovare velocemente non solo l'articolo che contiene una parola chiave, ma anche il punto esatto dell'articolo in cui quella parola compare.

## Utenti

### Utente anonimo

L'utente anonimo può accedere liberamente a tutti i contenuti pubblicati del sito.

Non sono previste funzionalità di registrazione, login pubblico, commenti, profili utente o interazioni social.

### Utente amministratore

L'utente amministratore è l'unico utente autenticato previsto dal sistema.

L'amministratore può:

- creare contenuti;
- modificare contenuti esistenti;
- eliminare contenuti;
- pubblicare o non pubblicare contenuti;
- gestire eventuali nuove aree tematiche;
- gestire link esterni di approfondimento;
- gestire i termini di tassonomia usati per le risorse salvate tramite web clipper.

## Ambito della prima release

La prima release pubblica del progetto deve includere sia le funzionalità principali di ricerca e consultazione degli articoli, sia le sezioni previste per la home page: notizie da feed RSS, ultime domande Stack Overflow, repository GitHub starred e risorse salvate tramite web clipper.

Lo sviluppo potrà procedere per incrementi tecnici successivi, ma il design dell'interfaccia deve considerare fin dall'inizio tutti gli elementi previsti per la prima release, in modo da evitare riprogettazioni successive del layout.

## Requisiti funzionali

### Contenuti

**RF001.** Il sistema deve consentire agli utenti anonimi di consultare tutti i contenuti pubblicati.

**RF002.** Il sistema deve impedire agli utenti anonimi di consultare contenuti non pubblicati.

**RF003.** Il sistema deve consentire all'utente amministratore di creare contenuti appartenenti alle aree tematiche principali del sito.

Le aree tematiche iniziali sono:

- HTML;
- CSS;
- JavaScript;
- Angular;
- PHP;
- Drupal;
- Varie.

**RF004.** Il sistema deve consentire l'aggiunta futura di nuove aree tematiche, per esempio Java, Flutter, SQL, Symfony, Ionic o UI/UX.

**RF005.** Il sistema deve consentire all'utente amministratore di scrivere liberamente il contenuto principale dell'articolo tramite editor HTML.

**RF006.** Il sistema deve supportare contenuti strutturati con tag HTML semantici, in particolare:

- `h2`;
- `h3`;
- `h4`;
- `p`;
- `ul`;
- `ol`;
- `table`;
- `pre`;
- `code`.

**RF007.** Il sistema deve consentire l'inserimento di snippet di codice all'interno del body del contenuto.

**RF008.** Il sistema deve consentire l'inserimento di link esterni di approfondimento sia associati all'intero articolo sia, quando necessario, contestualmente a specifici passaggi del contenuto.

**RF009.** Il sistema non deve prevedere l'associazione manuale di contenuti correlati ad altri contenuti del sito.

Questa funzionalità era presente nella versione precedente, ma non si è rivelata utile nell'uso reale del sito. Mantenerla aumenterebbe il lavoro di inserimento e manutenzione dei contenuti senza produrre un beneficio concreto nella consultazione quotidiana.

**RF010.** Il sistema non deve obbligare l'amministratore a classificare gli articoli tramite tag, difficoltà, stato di aggiornamento, data di verifica o versione.

### Ricerca

**RF011.** Il sistema deve consentire all'utente anonimo di eseguire una ricerca tramite parola chiave da qualunque pagina del sito.

**RF012.** La ricerca deve essere globale e deve essere eseguita su tutti i contenuti pubblicati.

**RF013.** La ricerca deve includere almeno:

- titolo del contenuto;
- body del contenuto;
- snippet di codice;
- tabelle;
- liste;
- campi personalizzati rilevanti per la consultazione pubblica, come i link di approfondimento.

**RF014.** La ricerca deve supportare parole parziali.

**RF015.** La ricerca deve gestire correttamente termini tecnici e caratteri speciali, per esempio:

- `<div>`;
- `::before`;
- `for...of`;
- `toString`;
- `drush cr`;
- `composer install`;
- `services.yml`;
- `hook_theme`.

**RF016.** La ricerca deve restituire tutte le occorrenze della parola cercata, non solo l'elenco degli articoli che la contengono.

**RF017.** Ogni occorrenza trovata deve mostrare uno snippet del contenuto in cui compare la parola cercata.

**RF018.** Lo snippet di ogni occorrenza deve evidenziare la parola cercata.

**RF019.** Le occorrenze devono essere raggruppate per articolo, senza nascondere occorrenze potenzialmente utili.

**RF020.** Ogni occorrenza deve essere presentata come risultato autonomo e selezionabile.

Non è un requisito mostrare all'utente la sezione dell'articolo in cui si trova l'occorrenza.

**RF021.** Il sistema non deve obbligare l'utente a distinguere i risultati in base alla posizione dell'occorrenza nel contenuto, per esempio titolo, sottotitolo, body, codice, lista o tabella.

La ricerca deve privilegiare la rapidità di accesso all'informazione, non la classificazione visibile delle occorrenze.

**RF022.** L'utente deve poter scegliere manualmente quale occorrenza aprire.

**RF023.** Cliccando su un'occorrenza, il sistema deve aprire l'articolo nel punto esatto in cui si trova l'occorrenza selezionata.

**RF024.** Dopo l'apertura dell'articolo, il termine cercato deve rimanere evidenziato nel contenuto.

**RF025.** La ricerca non deve richiedere una chiamata al backend a ogni digitazione.

**RF026.** La ricerca deve aggiornare i risultati progressivamente durante la digitazione, senza richiedere l'apertura di una pagina risultati separata o l'uso obbligatorio di un pulsante di invio.

**RF027.** Il sistema non deve prevedere filtri avanzati obbligatori per tecnologia, versione, difficoltà, data, stato o tipologia di contenuto.

**RF028.** Il sistema non deve prevedere suggerimenti automatici durante la digitazione, salvo eventuali evoluzioni future.

**RF029.** Il sistema non deve prevedere cronologia delle ricerche o ricerche salvate.

### Consultazione degli articoli

**RF030.** Il sistema deve consentire la lettura comoda di articoli lunghi senza obbligare a suddividerli in più pagine.

**RF031.** Il sistema deve visualizzare correttamente titoli, sottotitoli, paragrafi, liste, tabelle e blocchi di codice.

**RF032.** Il sistema deve applicare syntax highlighting agli snippet di codice.

I linguaggi inizialmente supportati devono includere almeno:

- HTML;
- CSS;
- JavaScript;
- TypeScript;
- PHP;
- YAML;
- JSON;
- SQL;
- Bash.

**RF033.** Il sistema deve consentire la copia rapida dei blocchi di codice.

**RF034.** Il sistema deve consentire la copia rapida dei comandi, quando riconoscibili come blocchi o righe di codice.

**RF035.** Il sistema deve consentire l'inserimento e la visualizzazione di brevi frammenti tecnici inline all'interno del testo degli articoli.

I frammenti tecnici inline possono includere, per esempio, nomi di chiavi di configurazione, nomi di file, comandi brevi, nomi di funzioni, nomi di metodi, selettori, tag HTML o valori tecnici.

**RF036.** I frammenti tecnici inline devono essere visivamente distinguibili dal testo normale senza interrompere il flusso di lettura.

**RF037.** Il sistema deve mostrare i link esterni di approfondimento associati all'articolo.

**RF038.** Il sistema non deve mostrare una sezione di contenuti correlati associati all'articolo.

La funzionalità è esclusa perché, pur essendo presente nella versione precedente, non è stata utilizzata in modo significativo. La consultazione del sito avviene principalmente tramite ricerca per parola chiave, non tramite navigazione tra contenuti suggeriti manualmente.

**RF039.** Il sistema non deve prevedere un indice laterale obbligatorio dell'articolo.

**RF040.** Il sistema non deve prevedere breadcrumb, poiché non è prevista una struttura di navigazione profonda.

### Home page

**RF041.** La home page deve dare priorità alla ricerca globale.

**RF042.** La home page deve rendere immediatamente visibili le aree tematiche disponibili nel sito.

Questa funzionalità ha lo scopo di aiutare i nuovi visitatori a comprendere rapidamente quali argomenti sono trattati, senza dover scorrere l'intera lista degli articoli.

**RF043.** L'elenco delle aree tematiche deve essere una funzione di orientamento e scoperta dei contenuti, senza sostituire la ricerca globale come interazione principale del sito.

**RF044.** La home page deve includere una sezione dedicata alle notizie provenienti da feed RSS selezionati.

**RF045.** La home page deve includere una sezione dedicata alle ultime domande pubblicate su Stack Overflow relative agli argomenti trattati dal sito.

**RF046.** La home page deve includere una sezione dedicata ai repository GitHub starred.

**RF047.** La home page deve includere una sezione dedicata ai link salvati tramite web clipper.

### Web clipper

**RF048.** Il sistema deve prevedere una funzionalità web clipper basata su estensione Chrome.

**RF049.** L'estensione Chrome deve consentire all'amministratore di salvare la pagina web attualmente aperta.

**RF050.** Il sistema deve creare un contenuto Drupal dedicato per ogni pagina salvata tramite web clipper.

**RF051.** Ogni risorsa salvata tramite web clipper deve includere almeno:

- titolo della pagina;
- URL della pagina;
- tag associato.

**RF052.** I tag delle risorse salvate devono essere gestiti tramite tassonomia Drupal.

**RF053.** I tag delle risorse salvate non devono essere usati come sistema generale di classificazione degli articoli tecnici.

### Amministrazione

**RF054.** Il sistema deve consentire all'amministratore di gestire i contenuti tramite backend Drupal.

**RF055.** Il sistema deve consentire all'amministratore di pubblicare e non pubblicare contenuti.

**RF056.** Il sistema deve consentire all'amministratore di gestire i termini di tassonomia usati per le risorse salvate.

**RF057.** Il sistema non deve consentire agli utenti anonimi di creare contenuti, commentare, registrarsi o accedere ad aree private.

### Profilo pubblico e contatti

**RF058.** Il sistema deve mostrare all'utente anonimo una sezione contatti accessibile da un pulsante presente nell'interfaccia principale.

**RF059.** La sezione contatti deve includere almeno le informazioni pubbliche dell'amministratore del sito.

**RF060.** La sezione contatti deve consentire il download del CV dell'amministratore.

**RF061.** I dati mostrati nella sezione contatti non devono essere inseriti come stringhe fisse nel frontend Angular, ma devono essere recuperati dal backend Drupal.

**RF062.** I dati pubblici dell'amministratore e il file CV devono essere gestiti a partire dall'entità User di Drupal o da campi collegati all'utente amministratore.

**RF063.** Il footer deve mostrare l'indirizzo email pubblico dell'amministratore.

**RF064.** Cliccando sull'indirizzo email nel footer, il sistema deve offrire almeno due azioni: apertura del client email tramite link `mailto:` e copia dell'indirizzo email negli appunti.

**RF065.** Il sistema non deve prevedere una sezione separata "Strumenti utili".

Questa funzionalità è presente nella versione precedente, ma non si è rivelata utile nell'uso quotidiano. Eventuali link utili potranno essere gestiti come risorse salvate tramite web clipper.

## Requisiti non funzionali

**RNF001.** La presentazione dei risultati di ricerca deve essere istantanea dopo il caricamento iniziale dei contenuti.

**RNF002.** Il sistema può prevedere un caricamento iniziale più lungo, purché le ricerche successive siano rapide.

**RNF003.** La ricerca deve continuare a essere veloce anche con un numero di contenuti superiore a quello attuale.

**RNF004.** Il sito deve essere ottimizzato principalmente per consultazione desktop.

**RNF005.** Il sito deve essere responsive e consultabile anche da dispositivi mobili.

**RNF006.** Il sito deve essere accessibile da tastiera.

**RNF007.** Gli elementi interattivi devono avere stati di focus visibili.

**RNF008.** Il sito deve usare markup semantico dove possibile.

**RNF009.** Il sito deve evitare animazioni non necessarie.

**RNF010.** Le eventuali animazioni presenti devono rispettare le preferenze dell'utente relative alla riduzione del movimento.

**RNF011.** Il sito deve garantire buona leggibilità del testo tecnico e degli snippet di codice.

**RNF012.** Il sito non deve utilizzare cookie di profilazione.

**RNF013.** Il sito non deve prevedere analytics, per evitare complessità non necessarie relative a privacy, cookie e GDPR.

**RNF014.** Il sito deve essere progettato tenendo conto della SEO, pur mantenendo un'architettura decoupled Drupal + Angular.

**RNF015.** Il codice deve essere organizzato in modo leggibile e manutenibile.

**RNF016.** Il repository deve documentare in modo chiaro requisiti, analisi e decisioni tecniche, così da rendere comprensibili le scelte progettuali prima dell'implementazione.

## Requisiti tecnici

**RT001.** Il backend deve essere realizzato con Drupal 11.

**RT002.** Il frontend deve essere realizzato con una versione moderna di Angular.

**RT003.** Il progetto deve mantenere un'architettura decoupled, con Drupal come backend CMS/API e Angular come frontend pubblico.

**RT004.** Drupal deve gestire:

- content type;
- campi;
- contenuti;
- link di approfondimento;
- dati pubblici dell'amministratore;
- file CV dell'amministratore;
- tassonomia per le risorse salvate;
- API per il frontend;
- endpoint per il web clipper.

**RT005.** Angular deve gestire:

- rendering pubblico del sito;
- recupero dei contenuti da Drupal;
- visualizzazione della modale contatti;
- download del CV;
- gestione delle azioni email nel footer;
- ricerca client-side;
- costruzione dell'indice locale;
- risultati basati su occorrenze;
- navigazione verso il punto esatto dell'articolo;
- evidenziazione della parola cercata;
- syntax highlighting;
- copia dei blocchi di codice.

**RT006.** Il frontend deve costruire un indice locale dei contenuti ricevuti dal backend.

**RT007.** L'indice locale deve essere basato su segmenti ricercabili estratti dal body HTML degli articoli.

**RT008.** I segmenti ricercabili devono poter rappresentare almeno:

- heading;
- paragrafi;
- liste;
- celle di tabella;
- blocchi di codice;
- link.

**RT009.** La ricerca deve restituire oggetti che rappresentano singole occorrenze, non solo articoli.

**RT010.** Ogni occorrenza deve contenere le informazioni necessarie per generare snippet, evidenziazione e navigazione al punto esatto dell'articolo.

**RT011.** Il sistema deve valutare una strategia di cache locale più robusta del semplice localStorage, per esempio IndexedDB, se necessaria alla crescita dei contenuti.

**RT012.** Drupal deve esporre al frontend solo contenuti pubblicati.

**RT013.** Il body HTML proveniente da Drupal deve essere gestito in modo sicuro, evitando l'inserimento di HTML non controllato da utenti anonimi.

**RT014.** Il sistema deve prevedere una strategia per la migrazione dei contenuti dall'attuale sito Drupal 8 alla nuova installazione Drupal 11.

**RT015.** La migrazione deve preservare, dove possibile:

- titolo;
- body HTML;
- content type o area tematica;
- link di approfondimento;
- struttura dei blocchi di codice.

**RT016.** Il repository GitHub deve contenere sia il codice sia la documentazione del progetto.

**RT017.** La documentazione deve includere almeno:

- requisiti;
- analisi funzionale;
- analisi UX/UI;
- design system;
- analisi tecnica;
- decisioni architetturali;
- strategia di migrazione;
- strategia di deploy.

**RT018.** Drupal deve esporre al frontend i dati pubblici dell'amministratore necessari alla sezione contatti, al footer e al download del CV.

**RT019.** Angular deve recuperare i dati pubblici dell'amministratore da Drupal e usarli per popolare la modale contatti, il pulsante di download del CV e l'indirizzo email nel footer.

**RT020.** Il sistema deve prevedere una strategia tecnica per recuperare e mostrare nella home page notizie da feed RSS, ultime domande Stack Overflow, repository GitHub starred e risorse salvate tramite web clipper.

## Vincoli

**V001.** Il sito attuale è ospitato su Aruba.

**V002.** L'attuale processo di deploy avviene tramite FileZilla.

**V003.** Non è garantita la disponibilità di Composer, Drush o accesso SSH sull'hosting di produzione.

**V004.** Il processo di deploy deve quindi poter prevedere build, installazione dipendenze e preparazione dei file in ambiente locale.

**V005.** Il frontend Angular e il backend Drupal devono essere pubblicati separatamente e devono poter essere aggiornati, modificati o sostituiti in modo indipendente.

In particolare, deve essere possibile aggiornare o modificare Angular senza intervenire sul backend Drupal e, viceversa, deve essere possibile aggiornare o modificare Drupal senza intervenire sul frontend Angular, salvo eventuali adeguamenti necessari al contratto API condiviso.

**V006.** La soluzione preferita prevede il dominio principale per il frontend Angular e un sottodominio dedicato per il backend Drupal.

Esempio:

- `www.appunti-digitali.it` per il frontend Angular;
- `cms.appunti-digitali.it` per il backend Drupal.

**V007.** Il DocumentRoot del sottodominio Drupal dovrebbe puntare alla cartella `web` del progetto Drupal, in modo da evitare URL contenenti `/web/`.

**V008.** Il progetto deve evitare funzionalità che introducono complessità privacy non necessaria, come account pubblici, commenti, analytics e cookie di profilazione.

**V009.** I contenuti lunghi non devono essere suddivisi artificialmente solo per ridurre la lunghezza delle pagine.

**V010.** Il sistema non deve introdurre classificazioni manuali non utili all'uso quotidiano del sito.

## Funzionalità escluse

Le seguenti funzionalità sono escluse dalla nuova versione del progetto:

- registrazione utenti pubblici;
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

In particolare, la funzionalità di associazione manuale di contenuti correlati tra articoli è presente nella versione attuale del sito, ma viene rimossa nella nuova versione perché non si è dimostrata utile nell'uso quotidiano. La consultazione avviene principalmente tramite ricerca per parola chiave, quindi mantenere contenuti correlati manuali introdurrebbe un costo di manutenzione non giustificato.

La sezione "Strumenti utili" è presente nella versione attuale del sito, ma viene rimossa nella nuova versione perché consultata raramente. Eventuali link utili potranno essere gestiti in modo più coerente attraverso il futuro sistema di risorse salvate tramite web clipper.

## Criteri di successo

Il progetto potrà essere considerato riuscito quando:

- l'utente riuscirà a cercare una parola chiave da qualunque pagina;
- la ricerca restituirà rapidamente tutte le occorrenze trovate;
- l'utente potrà scegliere l'occorrenza desiderata;
- il click su un'occorrenza porterà direttamente al punto corretto dell'articolo;
- il termine cercato sarà evidenziato nei risultati e nell'articolo;
- gli snippet di codice saranno leggibili e copiabili;
- i contenuti migrati da Drupal 8 saranno consultabili correttamente nella nuova versione;
- la home page includerà le sezioni previste per notizie, Stack Overflow, GitHub starred e risorse salvate;
- un nuovo visitatore riuscirà a capire rapidamente quali aree tematiche sono presenti nel sito senza dover scorrere l'intera lista degli articoli;
- il web clipper consentirà di salvare una pagina web come risorsa Drupal associata a un tag tassonomico;
- il sito sarà accessibile, responsive e adatto alla consultazione quotidiana;
- Drupal e Angular potranno essere gestiti come applicazioni separate;
- il repository GitHub documenterà in modo chiaro requisiti, analisi funzionale, analisi UX/UI, design system, decisioni tecniche, sviluppo, migrazione e deploy.
