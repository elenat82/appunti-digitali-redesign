# Analisi tecnica

## Decisioni già fissate

La nuova versione di Appunti Digitali mantiene un'architettura decoupled composta da:

- Drupal 11 come backend CMS e sorgente principale dei contenuti applicativi;
- Angular come frontend pubblico;
- API HTTP come canale di comunicazione tra backend e frontend.

Il frontend è realizzato con Angular 22, versione stabile disponibile al momento dell'inizializzazione del progetto.

Drupal e Angular devono rimanere applicazioni separate e devono poter essere sviluppati e pubblicati indipendentemente, mantenendo stabile il contratto API condiviso.

La ricerca dei contenuti viene eseguita client-side.

Drupal fornisce ad Angular i dati necessari alla costruzione dell'indice locale, ma la digitazione di una query non deve generare una nuova richiesta al backend.
Una volta disponibili i dati e costruito l'indice, ricerca, individuazione delle occorrenze e generazione dei risultati avvengono nel browser.

Il sito non prevede autenticazione degli utenti pubblici. L'unico utente autenticato è l'amministratore, che utilizza Drupal per la gestione dei contenuti e le funzionalità amministrative previste dal progetto.

## Architettura generale del sistema

Appunti Digitali è composto principalmente da un backend Drupal 11 e da un frontend Angular separati.

### Backend Drupal

Drupal rappresenta la sorgente principale dei contenuti gestiti dall'amministratore.

Ha la responsabilità di:

- gestire gli articoli e le relative aree tematiche;
- gestire i link di approfondimento;
- gestire le risorse salvate tramite web clipper;
- gestire i dati pubblici dell'amministratore e il file CV;
- gestire le tassonomie necessarie;
- esporre al frontend i dati pubblici attraverso API HTTP;
- ricevere le richieste amministrative provenienti dal web clipper.

Gli utenti pubblici non interagiscono direttamente con l'interfaccia Drupal.

### Frontend Angular

Angular rappresenta l'interfaccia pubblica del sito.

Ha la responsabilità di:

- recuperare i dati pubblici necessari;
- renderizzare l'interfaccia;
- gestire routing e navigazione;
- mostrare articoli e contenuti tecnici;
- costruire e utilizzare l'indice locale della ricerca;
- mostrare i risultati per singola occorrenza;
- gestire la navigazione verso il punto esatto dell'articolo;
- integrare i dati provenienti dai servizi esterni previsti per la home page;
- gestire gli stati di loading ed errore dell'interfaccia.

Angular non modifica direttamente i contenuti editoriali del sito.

### Servizi esterni

Alcune sezioni della home page utilizzano dati provenienti da servizi esterni, come Stack Overflow e GitHub.

Per ciascuna integrazione è stato valutato se:

- Angular debba interrogare direttamente il servizio esterno;
- oppure Drupal debba recuperare o mediare il dato e successivamente esporlo ad Angular.

La scelta è stata effettuata considerando esigenze di cache, CORS, rate limit, sicurezza e disponibilità del servizio.

La soluzione scelta prevede che anche GitHub e Stack Overflow vengano interrogati tramite Drupal, che recupera i dati dai rispettivi servizi e li espone successivamente ad Angular.

Questa soluzione differisce dalla versione attuale, nella quale Angular interroga direttamente entrambi i servizi.

### Web clipper

L'estensione Chrome utilizzata come web clipper costituisce un client separato dal frontend pubblico.

Il web clipper comunica con Drupal per creare nuove risorse salvate.

Autenticazione, autorizzazione, formato delle richieste e relativo endpoint verranno definiti nella sezione dedicata.

## Struttura del frontend Angular

Il frontend Angular rappresenta l'interfaccia pubblica di Appunti Digitali.

L'applicazione deve essere organizzata in modo da mantenere separate:

- struttura generale dell'interfaccia;
- funzionalità applicative;
- accesso ai dati;
- componenti riutilizzabili;
- modelli utilizzati dal frontend.

### Application shell

All'apertura del sito Angular deve mostrare immediatamente la struttura principale dell'interfaccia.

L'application shell comprende gli elementi persistenti del layout, come:

- header;
- search bar globale;
- sidebar di navigazione;
- area principale destinata al contenuto;
- footer.

Il caricamento dei dati non deve impedire la visualizzazione e l'utilizzo degli elementi dell'interfaccia che sono già disponibili.

Le diverse sezioni vengono popolate progressivamente quando i relativi dati diventano disponibili e ciascuna area gestisce autonomamente loading ed eventuali errori.

Non viene quindi previsto, durante il normale utilizzo del sito, un loader globale che blocchi l'intera applicazione in attesa del completamento di tutte le richieste.

### Organizzazione per funzionalità

Il frontend viene organizzato principalmente per feature e non per tipo tecnico di file.

Le principali feature previste sono:

- home;
- articoli;
- ricerca;
- navigazione laterale;
- profilo pubblico;
- integrazioni della home;
- risorse salvate.

Gli elementi utilizzati da più feature vengono invece collocati in un'area condivisa.

Una possibile organizzazione concettuale è:

    src/app/
    ├── core/
    ├── layout/
    ├── features/
    │   ├── home/
    │   ├── article/
    │   └── search/
    └── shared/

La struttura definitiva delle directory verrà definita durante l'implementazione, mantenendo comunque la separazione tra responsabilità.

### Componenti Angular

La nuova applicazione utilizza componenti standalone, salvo eventuali necessità introdotte da librerie esterne.

I componenti devono avere responsabilità limitate e chiaramente definite.

I componenti visuali ricevono preferibilmente dati già elaborati e non devono conoscere direttamente la struttura delle risposte provenienti da Drupal o dai servizi esterni.

La logica di accesso ai dati, normalizzazione e gestione dello stato viene separata dalla sola presentazione dell'interfaccia.

### Routing

Il routing Angular gestisce almeno:

- home page;
- pagina articolo.

La navigazione verso un articolo deve utilizzare URL stabili e direttamente raggiungibili.

La navigazione proveniente dalla ricerca utilizza la stessa pagina articolo, aggiungendo le informazioni necessarie per:

- raggiungere l'occorrenza selezionata;
- evidenziare il termine cercato;
- permettere il ritorno ai risultati precedenti.

Il routing non deve dipendere dagli identificativi interni delle tabelle Drupal.

La struttura definitiva degli URL verrà definita insieme alle considerazioni relative a SEO e rendering dell'applicazione.

### Accesso ai dati

Le chiamate HTTP non vengono effettuate direttamente dai componenti visuali.

L'accesso alle diverse sorgenti viene incapsulato in servizi dedicati, ad esempio per:

- articoli Drupal;
- profilo pubblico;
- risorse salvate;
- feed RSS;
- Stack Overflow;
- GitHub.

I servizi di accesso ai dati hanno la responsabilità di comunicare con le API e restituire al resto dell'applicazione dati utilizzabili dal frontend.

Il frontend non deve dipendere direttamente dai nomi dei campi o dalla struttura interna delle entità Drupal.

Le risposte delle API vengono quindi trasformate, quando necessario, in modelli applicativi indipendenti dal backend.

### Modelli frontend

I diversi content type tecnici di Drupal vengono ricondotti a un unico modello frontend di articolo.

Concettualmente il modello contiene almeno:

    Article
    ├── id
    ├── title
    ├── area
    ├── body
    ├── externalLinks
    └── weight

La forma definitiva dei modelli verrà stabilita insieme al contratto delle API.

Questa separazione permette di modificare successivamente il modello Drupal senza propagare necessariamente tali modifiche a tutti i componenti Angular.

### Gestione dello stato

Lo stato deve rimanere il più possibile vicino alla feature che lo utilizza.

Gli stati locali dei componenti possono essere gestiti direttamente dai componenti stessi.

Gli stati che devono sopravvivere alla navigazione tra componenti o essere condivisi tra più parti dell'applicazione vengono invece gestiti tramite servizi dedicati.

Questo riguarda in particolare lo stato della ricerca, che deve poter
conservare:

- query inserita;
- risultati ottenuti;
- occorrenza selezionata;
- informazioni necessarie per tornare ai risultati dopo l'apertura di un articolo.

Per lo stato reattivo locale e condiviso verranno utilizzati gli strumenti nativi di Angular quando sufficienti.

RxJS rimane disponibile per la gestione delle operazioni asincrone e dei flussi derivanti dalle API HTTP.

Non viene introdotta preventivamente una libreria globale di state management: la sua necessità verrà rivalutata solo se la complessità reale dell'applicazione lo richiederà.

### Ricerca

La ricerca costituisce una feature autonoma ma trasversale all'intera applicazione.

La search bar appartiene all'application shell e rimane disponibile da tutte le pagine.

La logica relativa a:

- costruzione dell'indice;
- esecuzione delle query;
- generazione delle occorrenze;
- mantenimento dello stato della ricerca;

non deve essere implementata direttamente nel componente della search bar.

Il dettaglio dell'architettura della ricerca viene definito nelle sezioni dedicate alla ricerca client-side, alla segmentazione dei contenuti e alla navigazione verso le occorrenze.

### Integrazioni della home

Le sezioni della home che dipendono da sorgenti differenti devono rimanere indipendenti tra loro.

Il mancato caricamento, ad esempio, dei dati GitHub non deve impedire il caricamento di Stack Overflow, dei feed RSS o delle altre sezioni.

Ogni integrazione dispone quindi del proprio stato di:

- loading;
- contenuto disponibile;
- errore;
- eventuale retry.

Le integrazioni della home sono considerate contenuti opzionali e il loro mancato caricamento non deve impedire la consultazione degli articoli.

## Modello dei dati in Drupal

### Articoli tecnici

La versione attuale utilizza un content type distinto per ogni area tematica.

Le aree iniziali sono:

- HTML;
- CSS;
- JavaScript;
- Angular;
- PHP;
- Drupal;
- Varie.

Le aree tematiche non sono codificate staticamente nel frontend.

Ogni content type tecnico può essere identificato come area tematica tramite configurazione aggiunta dal modulo custom `appunti_digitali`.

La configurazione dell'area viene memorizzata come third-party settings della config entity del content type e comprende:

- `area`, che indica se il content type deve essere esposto come area tematica;
- `icon`, che contiene il nome del file SVG associato all'area;
- `weight`, che determina l'ordine dell'area nella navigazione.

Le icone delle aree sono file SVG statici distribuiti con il modulo custom `appunti_digitali` nella directory `assets/icons`.

Il frontend non mantiene quindi una propria lista statica delle aree o delle relative icone. Una nuova area che utilizza lo stesso modello può essere aggiunta lato Drupal senza richiedere una modifica al codice Angular.

I content type hanno attualmente la stessa struttura, ma vengono mantenuti separati per lasciare la possibilità futura di differenziarli senza dover modificare il modello editoriale esistente.

Dal punto di vista del frontend, i diversi content type vengono comunque normalizzati in un unico modello di articolo.

Ogni content type tecnico contiene i seguenti campi.

#### Title

Campo base `title` del nodo Drupal.

Il titolo viene utilizzato:

- nella navigazione laterale;
- nella pagina articolo;
- nei risultati di ricerca;
- nell'indice locale della ricerca.

#### Body

Campo custom `field_body` di tipo testo formattato lungo.

Il campo utilizza attualmente il text format `Full HTML` e può contenere:

- heading;
- paragrafi;
- liste;
- tabelle;
- blocchi di codice;
- codice inline;
- link;
- immagini;
- embed esterni.

Il body rappresenta la principale sorgente per la costruzione dei segmenti ricercabili utilizzati dalla ricerca client-side.

La configurazione definitiva del text format e degli elementi HTML consentiti verrà approfondita nella sezione dedicata al rendering sicuro del body HTML.

#### Approfondimenti

Campo custom `field_approfondimenti` di tipo Link, multivalore e senza limite prefissato di elementi.

Gli approfondimenti fanno parte del contenuto pubblico e devono essere esposti al frontend e inclusi nella ricerca.

Il modello deve inoltre permettere di mantenere link inseriti contestualmente direttamente nel body quando una fonte è relativa a uno specifico passaggio dell'articolo.

#### Weight

Il campo `field_weight` utilizza il tipo di campo fornito dal modulo contrib Weight.

Il peso determina l'ordinamento degli articoli all'interno della relativa area tematica.

Il modulo Weight viene utilizzato anche per fornire all'amministratore un'interfaccia di riordinamento drag-and-drop, evitando di dover modificare manualmente i valori di più contenuti quando cambia la loro posizione.

L'ordinamento non deve dipendere necessariamente dalla data di creazione, perché la sequenza degli articoli può essere stabilita in base alla logica dell'argomento o alle preferenze dell'amministratore.

Il valore deve quindi essere disponibile al frontend per la costruzione della navigazione laterale.

### Profilo pubblico dell'amministratore

Le informazioni pubbliche dell'amministratore vengono mantenute sull'entità Drupal `User`.

L'account utilizza i seguenti campi pubblici:

- `field_full_name`: nome pubblico;
- `field_professional_role`: ruolo professionale;
- `field_presentation`: breve presentazione;
- `field_public_email`: indirizzo email pubblico;
- `field_phone`: numero di telefono opzionale;
- `field_linkedin`: profilo LinkedIn;
- `field_github`: profilo GitHub;
- `field_cv`: file PDF del CV;
- `user_picture`: avatar.

L'indirizzo email pubblico viene mantenuto separato dall'indirizzo email tecnico dell'account Drupal, anche quando i due valori coincidono.

In questo modo il dato utilizzato per autenticazione, notifiche e gestione dell'account rimane distinto dal dato esplicitamente destinato alla pubblicazione.

Il frontend deve tollerare l'assenza dei campi opzionali senza considerare invalido l'intero profilo.

### Campi rimossi

I seguenti campi presenti nella versione attuale non vengono mantenuti nella nuova versione.

#### Tag

Il campo `Tag` non viene mantenuto.

Pur essendo presente nei content type attuali, non è stato utilizzato nell'uso reale del sito e non fa parte del nuovo sistema di classificazione degli articoli.

La tassonomia rimane invece prevista per le risorse salvate tramite web clipper.

#### Correlati

Il campo `Correlati` viene rimosso.

La funzionalità di associazione manuale tra articoli non viene mantenuta perché non è stata utilizzata in modo significativo e la consultazione del sito avviene principalmente tramite ricerca.

### Revisioni

I content type tecnici non utilizzano attualmente il sistema di revisioni.

L'introduzione delle revisioni non è necessaria per soddisfare i requisiti della nuova versione e può essere valutata separatamente come eventuale funzionalità amministrativa futura.

## API Drupal → Angular

La comunicazione tra Drupal e Angular avviene tramite API HTTP.

Il contratto API deve permettere al frontend di utilizzare modelli applicativi indipendenti dalla struttura interna delle entità Drupal.

### Scelta del meccanismo API

Le API utilizzate dal frontend pubblico hanno principalmente lo scopo di fornire dataset completi e predefiniti.

Angular non necessita di costruire dinamicamente query verso Drupal: non sono previsti filtri, ordinamenti o selezioni dei campi inviati dal client.

Per ogni tipo di dato viene utilizzato il meccanismo più adatto al relativo contratto applicativo.

JSON:API è stato valutato ma, nel contesto attuale, offrirebbe funzionalità di interrogazione generica delle entità che il frontend non necessita.

Le Views REST possono essere utilizzate quando il dataset corrisponde direttamente a una selezione di entità e campi Drupal.

Gli endpoint custom vengono invece utilizzati quando la response richiede validazione, normalizzazione o altra logica applicativa specifica.

Gli endpoint `/api/areas` e `/api/articles/{area}` sono quindi implementati dal modulo custom `appunti_digitali`.

### Discovery delle aree tematiche

Angular non mantiene un elenco statico dei content type tecnici.

Il caricamento inizia tramite un endpoint di discovery:

    GET /api/areas

L'endpoint restituisce le aree tematiche abilitate in Drupal, ordinate secondo
il relativo weight.

Ogni area contiene almeno:

    Area
    ├── id
    ├── label
    ├── iconUrl
    └── weight

`id` corrisponde all'identificativo dell'area utilizzato per richiedere i
relativi articoli.

`label` contiene il nome pubblico dell'area.

`iconUrl` contiene l'URL pubblico dell'icona SVG associata all'area.

`weight` determina l'ordine dell'area nella navigazione laterale.

L'URL dell'icona non viene memorizzato come URL assoluto nella configurazione
Drupal. Nei third-party settings viene conservato soltanto il nome del file,
mentre l'API costruisce l'URL pubblico in base all'ambiente e alla richiesta
corrente.

### Recupero degli articoli per area

Dopo aver recuperato l'elenco delle aree, Angular effettua una richiesta indipendente per ciascuna area, concettualmente:

    GET /api/articles/html
    GET /api/articles/css
    GET /api/articles/javascript
    ...

L'elenco delle richieste viene quindi determinato dinamicamente dalla risposta di `/api/areas`.

L'endpoint verifica che l'identificativo richiesto corrisponda a un content type configurato come area tematica tramite il third-party setting `appunti_digitali.area`.

Un content type esistente ma non configurato come area non viene esposto dall'endpoint.

La response contiene esclusivamente nodi pubblicati appartenenti all'area richiesta, ordinati tramite `field_weight`.

Il controller normalizza la struttura Drupal nel modello applicativo comune `Article`, evitando che il frontend dipenda direttamente dai nomi e dalla struttura interna dei campi Drupal.

Una nuova area può essere aggiunta in Drupal senza dover aggiungere il relativo identificativo al codice Angular.

Ogni risposta contiene la collezione completa degli articoli pubblicati appartenenti alla relativa area.

Ogni articolo contiene almeno:

    Article
    ├── id
    ├── title
    ├── area
    ├── body
    ├── externalLinks
    └── weight

Una volta recuperati, gli articoli delle diverse aree vengono normalizzati nel modello frontend comune e utilizzati per:

- navigazione laterale;
- costruzione dell'indice di ricerca;
- visualizzazione delle pagine articolo.

## Rendering sicuro del body HTML

### Text format Drupal

Gli articoli tecnici continuano a utilizzare il text format `Full HTML`.

Il sito non prevede autori pubblici o utenti che possano inserire contenuti: gli articoli vengono creati esclusivamente dall'amministratore.

Non viene quindi introdotto un text format più restrittivo con lo scopo di limitare gli elementi HTML utilizzabili durante la scrittura.

Questa scelta permette inoltre di mantenere continuità con gli articoli esistenti, che utilizzano già `Full HTML`, evitando trasformazioni non necessarie durante la migrazione a Drupal 11.

Il body deve poter continuare a contenere liberamente gli elementi necessari alla documentazione tecnica, tra cui:

- heading;
- paragrafi;
- liste;
- tabelle;
- blocchi di codice;
- codice inline;
- link;
- immagini;
- classi CSS utilizzate dalla presentazione;
- embed esterni previsti dal progetto.

### Rendering in Angular

Il fatto che Drupal utilizzi `Full HTML` non implica che Angular debba disabilitare globalmente i propri meccanismi di sicurezza.

Il body ricevuto dalle API viene considerato contenuto proveniente da una sorgente applicativa controllata, ma viene comunque renderizzato utilizzando i normali meccanismi previsti da Angular per l'inserimento di HTML nel DOM.

Non viene utilizzato globalmente un bypass della sanitizzazione per considerare automaticamente sicuro qualsiasi contenuto ricevuto dal backend.

Se alcuni elementi necessari agli articoli, in particolare embed o contenuti interattivi, richiedono una gestione particolare, questi casi vengono trattati esplicitamente invece di disabilitare le protezioni per l'intero body.

## Architettura della ricerca client-side

La ricerca viene eseguita interamente nel browser.

La digitazione di una query non genera richieste HTTP verso Drupal o verso altri servizi.

Drupal fornisce ad Angular i dataset degli articoli suddivisi per area.
Angular li aggrega in memoria nel dataset completo utilizzato per la ricerca.

### Flusso generale

Il flusso della ricerca è:

    Article[]
        ↓
    estrazione e normalizzazione dei contenuti
        ↓
    SearchSegment[]
        ↓
    indice locale in memoria
        ↓
    query dell'utente
        ↓
    ricerca delle occorrenze
        ↓
    SearchOccurrence[]
        ↓
    raggruppamento per articolo
        ↓
    visualizzazione dei risultati

La segmentazione dei contenuti e la struttura di `SearchSegment` e `SearchOccurrence` vengono definite nelle sezioni successive.

### Costruzione dell'indice

L'indice viene costruito a partire dal dataset completo degli articoli.

Devono essere inclusi almeno i contenuti ricercabili presenti in:

- titolo;
- body;
- link di approfondimento.

Il body viene analizzato come documento strutturato e non come un'unica stringa, in modo da mantenere informazioni sufficienti per individuare successivamente il punto esatto dell'articolo in cui è stata trovata un'occorrenza.

L'indice viene costruito quando il dataset degli articoli diventa disponibile.

Se Angular utilizza inizialmente una copia proveniente da IndexedDB, l'indice viene costruito a partire da quella copia.

Quando il dataset viene aggiornato con una versione più recente proveniente da Drupal, l'indice viene ricostruito.

### Tipo di ricerca

La prima implementazione non richiede necessariamente un motore di ricerca full-text o un indice invertito.

I requisiti principali sono infatti:

- ricerca progressiva durante la digitazione;
- ricerca case-insensitive;
- supporto delle parole parziali;
- supporto di caratteri e frammenti tecnici;
- individuazione di tutte le occorrenze;
- mantenimento della posizione del match all'interno del contenuto.

Per questi motivi la ricerca può inizialmente essere implementata come ricerca per sottostringa sui segmenti normalizzati.

Una query come:

    extends

deve quindi trovare anche occorrenze contenute in stringhe più lunghe.

Allo stesso modo la ricerca deve poter gestire frammenti tecnici come:

    .info.yml
    =>
    @Input
    ::before
    npm install

senza basarsi esclusivamente sulla separazione del testo in parole.

La scelta definitiva dell'algoritmo viene verificata tramite misurazioni sul dataset reale.

Una libreria esterna di ricerca verrà introdotta solo se fornisce un vantaggio concreto rispetto a una soluzione custom mantenendo i requisiti specifici dell'applicazione.

### Normalizzazione

Prima della ricerca sia il contenuto indicizzato sia la query vengono normalizzati secondo regole comuni.

La normalizzazione deve permettere almeno di:

- confrontare il testo senza distinguere maiuscole e minuscole;
- normalizzare differenze irrilevanti di spaziatura;
- gestire correttamente testo Unicode.

I caratteri tecnici e la punteggiatura non devono essere eliminati indiscriminatamente, perché possono rappresentare parte significativa della query.

La normalizzazione utilizzata per il confronto non deve modificare il contenuto originale utilizzato per mostrare snippet ed evidenziazioni.

### Tutte le occorrenze

La ricerca non restituisce semplicemente gli articoli che contengono la query.

Per ogni segmento devono essere individuate tutte le posizioni in cui la query compare.

Ogni match genera una `SearchOccurrence` distinta.

Un singolo articolo può quindi produrre più risultati se la stessa query compare in più punti del contenuto.

I risultati vengono successivamente raggruppati per articolo esclusivamente per la presentazione nell'interfaccia.

### Stato della ricerca

La logica della ricerca viene gestita da un servizio dedicato della feature `search`.

Il componente della search bar non costruisce direttamente l'indice e non esegue autonomamente la ricerca.

Lo stato condiviso deve comprendere almeno:

- query corrente;
- stato di preparazione dell'indice;
- risultati correnti;
- numero totale delle occorrenze;
- articoli interessati;
- occorrenza eventualmente selezionata.

Questo permette di mantenere lo stato della ricerca anche durante la navigazione verso un articolo e di ripristinare gli stessi risultati tramite l'azione `Torna ai risultati`.

### Ricerca durante la preparazione dell'indice

La search bar rimane utilizzabile anche se l'indice non è ancora pronto.

Se l'utente digita una query durante la costruzione dell'indice:

1. la query viene conservata;
2. l'interfaccia comunica che la ricerca è in preparazione;
3. non vengono effettuate richieste aggiuntive al backend;
4. appena l'indice diventa disponibile, la query già presente viene eseguita automaticamente.

### Aggiornamento progressivo dei risultati

I risultati vengono aggiornati mentre l'utente modifica la query.

Non viene prevista una pagina separata dei risultati né è necessario inviare esplicitamente la ricerca tramite un pulsante.

L'eventuale introduzione di un breve debounce viene valutata durante l'implementazione in base al costo reale della ricerca e non costituisce un requisito architetturale.

### Soglia minima della query

Rimane da definire il numero minimo di caratteri che devono essere presenti nella query prima di eseguire effettivamente la ricerca.

La scelta deve tenere conto di:

- quantità di risultati prodotti da query molto brevi;
- costo della ricerca sul dataset reale;
- necessità di ricercare frammenti tecnici brevi;
- qualità e utilità dei risultati mostrati durante la digitazione.

La soglia viene definita dopo una verifica sul dataset reale e rimane distinta dall'eventuale utilizzo di un debounce.

### Contenuti esclusi

Non tutto il markup presente nel body deve necessariamente entrare nell'indice.

Le regole precise di inclusione ed esclusione vengono definite durante la segmentazione del body.

### Performance

La soluzione iniziale privilegia semplicità e prevedibilità.

La complessità dell'indice e dell'algoritmo di ricerca deve essere aumentata solo se le misurazioni sul dataset reale mostrano problemi di performance.

Se costruzione dell'indice o ricerca dovessero causare blocchi percepibili dell'interfaccia potranno essere valutati, in ordine:

- ottimizzazione delle strutture dati;
- riduzione del lavoro ripetuto tra una query e la successiva;
- esecuzione della costruzione o della ricerca in un Web Worker;
- utilizzo di una libreria specializzata di ricerca client-side.

L'interfaccia e i modelli `SearchSegment` e `SearchOccurrence` devono rimanere sufficientemente indipendenti dall'algoritmo utilizzato da permettere queste ottimizzazioni senza modificare il comportamento visibile della ricerca.

## Segmentazione dei contenuti e SearchOccurrence

La ricerca non indicizza ogni articolo come un unico blocco di testo.

Prima della costruzione dell'indice, i contenuti ricercabili vengono suddivisi in unità più piccole chiamate `SearchSegment`.

La segmentazione ha due obiettivi:

- produrre risultati e snippet sufficientemente contestualizzati;
- mantenere un riferimento al punto dell'articolo in cui si trova ciascuna occorrenza.

### SearchSegment

Un `SearchSegment` rappresenta una singola unità ricercabile appartenente a un
articolo.

Concettualmente contiene almeno:

    SearchSegment
    ├── id
    ├── articleId
    ├── type
    ├── order
    ├── text
    ├── searchText
    └── locator

Dove:

- `id` identifica il segmento all'interno del dataset corrente;
- `articleId` identifica l'articolo di appartenenza;
- `type` descrive il tipo di contenuto da cui deriva il segmento;
- `order` mantiene l'ordine del segmento all'interno dell'articolo;
- `text` contiene il testo originale utilizzato per snippet ed evidenziazione;
- `searchText` contiene la rappresentazione normalizzata utilizzata per il confronto con la query;
- `locator` contiene le informazioni necessarie per individuare nel DOM il contenuto corrispondente quando viene aperto l'articolo.

La struttura definitiva può essere adattata durante l'implementazione, ma deve mantenere separati il testo originale e quello eventualmente normalizzato per la ricerca.

### Segmenti generati dal titolo

Il titolo dell'articolo costituisce un segmento autonomo.

Questo permette di trattare un'occorrenza presente nel titolo allo stesso modo delle occorrenze presenti nel body, pur mantenendo la possibilità di individuare correttamente la sua posizione nella pagina.

### Segmentazione del body HTML

Il body viene analizzato come documento HTML strutturato.

Gli elementi che producono normalmente un segmento autonomo sono:

- heading;
- paragrafi;
- elementi delle liste;
- celle e intestazioni delle tabelle;
- blocchi di codice.

Un elemento come:

    <p>Drupal utilizza i service per...</p>

produce quindi un singolo segmento.

Una lista:

    <ul>
      <li>Primo elemento</li>
      <li>Secondo elemento</li>
    </ul>

produce invece un segmento distinto per ciascun `li`.

Analogamente, ogni cella significativa di una tabella viene trattata come segmento separato, evitando di trasformare un'intera tabella in un'unica stringa difficilmente utilizzabile come risultato di ricerca.

### Codice inline

Il codice inline non genera normalmente un segmento autonomo.

Un elemento come:

    <p>Il file <code>nome_modulo.info.yml</code> contiene...</p>

rimane parte del segmento generato dal paragrafo.

In questo modo una ricerca può trovare sia il testo normale sia il frammento tecnico mantenendo il contesto della frase in cui compare.

### Blocchi di codice

Un blocco di codice statico costituisce invece un segmento autonomo.

L'intero blocco viene mantenuto come unità ricercabile, preservando:

- contenuto;
- caratteri speciali;
- spaziatura significativa;
- interruzioni di riga quando utili alla presentazione del risultato.

La presenza di elementi `pre` e `code` annidati non deve produrre segmenti duplicati per lo stesso snippet.

### Link presenti nel body

Il testo visibile dei link presenti nei paragrafi, nelle liste, nelle tabelle o negli altri elementi testuali viene ricercato come parte del segmento che li contiene.

Quando necessario, anche l'URL associato al link può essere incluso nei dati ricercabili, senza modificare il testo originale utilizzato per la visualizzazione dello snippet.

### Approfondimenti

Ogni elemento del campo `Approfondimenti` genera un segmento ricercabile.

Devono poter essere ricercati almeno:

- eventuale testo o titolo del link;
- URL della risorsa.

Gli approfondimenti rimangono distinti dal body perché provengono da un campo Drupal separato, ma dal punto di vista della ricerca producono normali occorrenze associate allo stesso articolo.

### Contenuti esclusi

Non vengono indicizzati gli elementi puramente decorativi o privi di contenuto informativo.

Il contenuto interno degli embed CodePen è escluso dalla segmentazione quando rappresenta codice già presente nell'articolo tramite un normale blocco statico.

In questo modo la stessa porzione di codice non produce risultati duplicati.

Gli altri contenuti incorporati tramite provider esterni vengono valutati singolarmente nella sezione dedicata agli embed.

### Identificazione dei segmenti

Ogni segmento deve poter essere associato in modo deterministico al relativo contenuto nella pagina articolo.

Non è sufficiente conservare un offset globale all'interno della stringa HTML, perché markup e testo visibile non hanno necessariamente le stesse posizioni.

La navigazione utilizza quindi:

    articleId
        +
    segment locator
        +
    posizione dell'occorrenza nel segmento

Il meccanismo concreto utilizzato per collegare un `SearchSegment` al DOM può essere implementato tramite identificatori, attributi dedicati o una mappatura costruita durante il rendering.

La scelta implementativa deve comunque garantire che lo stesso segmento utilizzato dalla ricerca possa essere individuato nella pagina articolo.

### SearchOccurrence

Una `SearchOccurrence` rappresenta una singola corrispondenza tra la query e un `SearchSegment`.

Concettualmente contiene almeno:

    SearchOccurrence
    ├── articleId
    ├── segmentId
    ├── startOffset
    └── endOffset

`startOffset` ed `endOffset` identificano la posizione della corrispondenza all'interno del testo del segmento.

Se la stessa query compare tre volte nello stesso segmento vengono quindi prodotte tre `SearchOccurrence` distinte.

Ad esempio:

    Drupal utilizza Drupal Console, mentre Drupal core...

per la query:

    Drupal

produce tre occorrenze e non un unico risultato associato al paragrafo.

### Normalizzazione e offset

La ricerca può utilizzare una rappresentazione normalizzata del testo, mentre snippet ed evidenziazione devono utilizzare il testo originale.

La normalizzazione non deve quindi rendere impossibile ricondurre il match alla posizione originale.

Se una trasformazione modifica la lunghezza o la posizione dei caratteri, l'implementazione deve mantenere una corrispondenza tra gli offset del testo normalizzato e quelli del testo originale.

Quando possibile vengono preferite normalizzazioni che non alterano inutilmente la struttura del testo.

### Generazione dello snippet

Lo snippet visualizzato nei risultati viene generato a partire dal `SearchSegment` e dalla posizione della `SearchOccurrence`.

Lo snippet deve:

- mostrare un contesto sufficiente intorno al match;
- evidenziare la query;
- evitare di mostrare inutilmente l'intero segmento quando questo è molto lungo;
- preservare il contenuto tecnico significativo.

Per i blocchi di codice può essere più utile mostrare le righe vicine all'occorrenza invece di applicare esattamente la stessa logica utilizzata per il testo normale.

La lunghezza definitiva del contesto verrà definita durante l'implementazione e verificata visivamente sui contenuti reali.

### Ordinamento dei risultati

Le occorrenze mantengono l'ordine in cui compaiono nell'articolo.

La visualizzazione raggruppa successivamente le `SearchOccurrence` per articolo, senza perdere l'ordine interno dei match.

Non viene introdotto un ranking di rilevanza tipico dei motori full-text: l'obiettivo della ricerca è mostrare tutte le occorrenze trovate.

L'ordinamento dei gruppi di articoli segue, quando possibile, lo stesso ordinamento utilizzato dalla navigazione del sito.

### Relazione tra segmenti e risultati

Il flusso complessivo diventa quindi:

    Article
        ↓
    parsing del contenuto
        ↓
    SearchSegment[]
        ↓
    ricerca della query
        ↓
    SearchOccurrence[]
        ↓
    raggruppamento per articleId
        ↓
    snippet dei singoli match
        ↓
    risultati di ricerca

## Navigazione all'occorrenza ed evidenziazione

Quando l'utente seleziona una singola occorrenza dai risultati di ricerca, Angular apre l'articolo corrispondente e porta la viewport nel punto esatto in cui è presente il match selezionato.

La navigazione deve utilizzare le informazioni già contenute nella
`SearchOccurrence`:

    articleId
        +
    segmentId
        +
    startOffset
        +
    endOffset

Queste informazioni permettono di identificare:

- l'articolo da aprire;
- il segmento che contiene il risultato;
- la specifica occorrenza all'interno del segmento.

### URL dell'articolo e stato della ricerca

L'articolo mantiene un URL stabile e indipendente dalla ricerca.

Lo stesso articolo viene quindi utilizzato sia quando viene aperto direttamente sia quando viene raggiunto tramite un risultato di ricerca.

Le informazioni relative alla ricerca rappresentano stato temporaneo dell'interfaccia e non fanno parte necessariamente dell'URL canonico dell'articolo.

Quando la navigazione parte dai risultati devono essere mantenuti almeno:

- query corrente;
- elenco dei risultati;
- articolo selezionato;
- `SearchOccurrence` selezionata.

Questo stato viene conservato dal servizio dedicato alla ricerca durante la navigazione interna dell'applicazione.

In questo modo l'apertura di un articolo non richiede una nuova ricerca e l'azione `Torna ai risultati` può ripristinare lo stato precedente.

Se invece un articolo viene aperto direttamente, senza uno stato di ricerca precedente, viene mostrato normalmente senza evidenziazioni e senza l'azione `Torna ai risultati`.

### Collegamento tra SearchSegment e DOM

Durante il rendering dell'articolo ogni elemento che corrisponde a un `SearchSegment` deve poter essere identificato nel DOM.

Il collegamento può essere realizzato tramite un attributo dedicato, ad esempio:

    data-search-segment-id="article-12-segment-8"

L'identificatore viene generato in modo coerente con quello utilizzato durante la segmentazione.

Non viene utilizzata come riferimento la posizione assoluta del testo all'interno dell'HTML serializzato, perché markup e testo visibile possono avere strutture differenti.

La relazione è quindi:

    SearchOccurrence
        ↓
    segmentId
        ↓
    elemento DOM del SearchSegment
        ↓
    startOffset / endOffset
        ↓
    testo corrispondente

### Attesa del rendering

La navigazione verso l'occorrenza può avvenire solamente dopo che il contenuto dell'articolo è stato renderizzato.

Angular deve quindi attendere che:

1. l'articolo sia disponibile;
2. il body sia stato inserito nel DOM;
3. eventuali trasformazioni necessarie al contenuto siano state completate;
4. il segmento corrispondente alla `SearchOccurrence` sia disponibile.

Solo a questo punto vengono applicate evidenziazione e navigazione.

Per i blocchi di codice l'evidenziazione della ricerca deve essere applicata dopo l'eventuale syntax highlighting, in modo che quest'ultimo non elimini o sostituisca il markup introdotto per la ricerca.

### Evidenziazione della query

Quando un articolo viene aperto a partire dalla ricerca, le occorrenze della query presenti nell'articolo rimangono evidenziate.

L'evidenziazione utilizza lo stile grafico definito nel design system per il tag `<mark>`.

La specifica occorrenza selezionata dai risultati deve inoltre essere identificabile rispetto alle altre occorrenze della stessa query, in modo da rendere immediatamente chiaro il punto verso cui è avvenuta la navigazione.

La differenziazione può essere ottenuta tramite una variazione visiva aggiuntiva dello stesso pattern di evidenziazione, senza introdurre un nuovo significato semantico.

### Applicazione dell'evidenziazione al DOM

L'evidenziazione non deve essere realizzata tramite una semplice sostituzione testuale sull'HTML serializzato.

Una sostituzione indiscriminata potrebbe infatti:

- modificare tag o attributi HTML;
- rompere link o altri elementi inline;
- interferire con il syntax highlighting;
- introdurre markup non valido.

I match devono essere individuati nel contenuto testuale effettivamente renderizzato e associati ai relativi nodi di testo.

Quando necessario possono essere utilizzati i meccanismi DOM appropriati, come la suddivisione dei text node o le `Range`, per racchiudere esclusivamente il testo corrispondente alla query.

Questa logica deve funzionare anche quando il segmento contiene markup inline, ad esempio:

    <p>
      Il file <code>nome_modulo.info.yml</code> contiene...
    </p>

senza perdere la struttura originale del paragrafo.

### Occorrenze multiple nello stesso segmento

Uno stesso `SearchSegment` può contenere più occorrenze della query.

Ogni match rimane indipendente grazie ai relativi `startOffset` e `endOffset`.

Durante il rendering le occorrenze possono essere identificate tramite una chiave derivata, ad esempio dalla combinazione di:

    articleId
    +
    segmentId
    +
    startOffset

Non è quindi necessario salvare un identificativo permanente aggiuntivo nel backend.

### Posizionamento della viewport

Dopo aver individuato l'occorrenza selezionata, Angular porta la viewport sull'elemento corrispondente.

La navigazione deve posizionare il risultato in modo che rimanga chiaramente visibile e non venga nascosto dall'header persistente.

Per questo possono essere utilizzati meccanismi come `scrollIntoView()` insieme a un adeguato `scroll-margin` definito sul target.

Il comportamento deve funzionare sia nel layout desktop sia nel layout mobile, dove l'altezza dell'header può essere differente.

### Accessibilità della navigazione

Lo spostamento visuale della viewport deve essere accompagnato da una gestione coerente del focus da tastiera.

Quando un risultato viene aperto tramite tastiera, l'utente non deve ritrovarsi con il focus rimasto su un elemento appartenente alla pagina precedente.

L'occorrenza selezionata o un contenitore semanticamente appropriato vicino al match può quindi ricevere temporaneamente il focus programmatico.

L'eventuale elemento utilizzato esclusivamente come destinazione del focus può utilizzare `tabindex="-1"`, senza entrare nell'ordine normale di tabulazione.

Il focus deve utilizzare lo stile visivo previsto dal design system.

### Torna ai risultati

Quando un articolo è stato aperto a partire dalla ricerca viene mostrata l'azione `Torna ai risultati`.

L'azione:

- ripristina la vista dei risultati;
- mantiene la query precedentemente inserita;
- mantiene le `SearchOccurrence` già calcolate;
- non genera una nuova richiesta a Drupal;
- non ricostruisce inutilmente l'indice;
- non esegue nuovamente la ricerca se i risultati sono ancora disponibili
  nello stato applicativo.

La posizione di scorrimento dell'elenco dei risultati può essere conservata quando utile, in modo che l'utente ritorni al punto dal quale aveva aperto l'articolo.

### Navigazione tramite cronologia del browser

La navigazione articolo/risultati deve integrarsi con la normale cronologia del browser.

L'apertura di un articolo tramite un risultato costituisce una normale navigazione Angular.

Il pulsante Back del browser deve quindi permettere, quando lo stato dell'applicazione è ancora disponibile, di tornare alla precedente vista dei risultati con la query conservata.

L'azione esplicita `Torna ai risultati` offre lo stesso percorso in modo immediatamente riconoscibile nell'interfaccia.

### Reload e accesso diretto

Lo stato della ricerca è temporaneo e non rappresenta parte del contenuto persistente dell'articolo.

Se la pagina articolo viene caricata direttamente oppure viene effettuato un reload completo senza uno stato di ricerca disponibile, l'articolo viene visualizzato normalmente:

- senza evidenziazioni legate a una query precedente;
- senza tentare di raggiungere una `SearchOccurrence`;
- senza mostrare `Torna ai risultati`.

L'eventuale persistenza dello stato di ricerca oltre il ciclo di vita dell'applicazione non viene considerata necessaria nella prima implementazione.

### Gestione dei casi non validi

Se il segmento o l'occorrenza memorizzati non possono più essere individuati, ad esempio perché nel frattempo il dataset è stato aggiornato, la navigazione non deve produrre un errore bloccante.

L'articolo viene comunque aperto normalmente.

L'evidenziazione e lo scroll preciso vengono applicati solo quando la `SearchOccurrence` può essere ricondotta con certezza al contenuto corrente.

## Cache e persistenza locale

Gli articoli recuperati da Drupal costituiscono il dataset principale utilizzato dal frontend per:

- costruire la navigazione laterale;
- costruire l'indice di ricerca;
- visualizzare le pagine articolo.

Durante l'esecuzione dell'applicazione il dataset viene mantenuto in memoria, insieme alle strutture derivate necessarie alla ricerca.

### Persistenza degli articoli

Per evitare di recuperare nuovamente a ogni accesso le aree tematiche e i relativi dataset di articoli, il frontend mantiene nel browser anche una copia persistente di questi dati.

La versione attuale del sito utilizza `localStorage`.

Nella nuova versione viene utilizzato IndexedDB per la persistenza delle aree e degli articoli, perché il dataset comprende il body HTML completo e può quindi raggiungere dimensioni non adatte a essere gestite tramite `localStorage`.

IndexedDB permette inoltre di memorizzare i dati in modo asincrono senza utilizzare un'API sincrona durante il caricamento dell'applicazione.

La copia presente in IndexedDB costituisce esclusivamente una cache locale: Drupal rimane la sorgente autorevole dei contenuti.

### Caricamento iniziale

All'avvio dell'applicazione viene seguito, quando possibile, questo flusso:

1. viene verificata la presenza in IndexedDB delle aree tematiche e dei relativi dataset di articoli;
2. se disponibili, i dati locali vengono utilizzati per rendere rapidamente disponibili navigazione, articoli e costruzione dell'indice di ricerca;
3. in parallelo viene verificata la versione corrente delle aree tramite `/api/areas`;
4. per ciascuna area vengono verificati e, quando necessario, aggiornati i relativi articoli;
5. i dataset aggiornati sostituiscono soltanto le rispettive copie presenti in memoria e in IndexedDB;
6. quando cambiano gli articoli utilizzati dalla ricerca, l'indice viene ricostruito.

Al primo accesso, quando non è ancora presente una cache locale, Angular recupera le aree da Drupal e successivamente i relativi dataset di articoli, salvandoli in IndexedDB.

### Invalidazione della cache

La cache non deve basarsi esclusivamente su una durata temporale arbitraria.

La verifica della presenza di nuovi dati deve utilizzare, quando possibile, i normali meccanismi HTTP di validazione della cache, come `ETag` o `Last-Modified`.

La validazione deve poter essere effettuata indipendentemente per il discovery delle aree e per i dataset degli articoli delle singole aree, evitando di trasferire nuovamente dati che non sono cambiati.

La strategia definitiva dipenderà dalla configurazione effettiva degli endpoint Drupal e verrà verificata durante l'implementazione delle API.

### Indice di ricerca

L'indice di ricerca è un dato derivato dagli articoli e non rappresenta una sorgente autonoma di contenuto.

Nella prima implementazione l'indice viene quindi costruito in memoria a partire dal dataset degli articoli.

Non viene prevista inizialmente la persistenza dell'indice in IndexedDB.

Questa scelta evita di dover sincronizzare separatamente dataset e indice e riduce il rischio di utilizzare un indice non più coerente con i contenuti.

Se le misurazioni sulle prestazioni mostreranno che la costruzione dell'indice ha un costo significativo, potrà essere valutata anche la persistenza della struttura utilizzata per la ricerca.

La modalità concreta dipenderà dall'implementazione scelta per l'indice e dovrà garantire che la struttura persistita rimanga associata alla stessa versione del dataset da cui è stata generata.

### Gestione degli errori

Un errore nell'accesso a IndexedDB non deve impedire l'utilizzo del sito.

In caso di cache locale assente, corrotta o non disponibile, Angular deve poter recuperare normalmente i dati da Drupal e utilizzare esclusivamente la copia in memoria per la sessione corrente.

Analogamente, se Drupal non è temporaneamente raggiungibile ma è disponibile una copia locale precedentemente valida, questa può essere utilizzata per consentire la consultazione dei contenuti già memorizzati.

La cache non introduce comunque un requisito di funzionamento offline completo del sito.

### Dati provenienti da servizi esterni

La strategia di cache per feed RSS, Stack Overflow e GitHub è definita separatamente per ciascuna integrazione nella sezione dedicata alle integrazioni esterne.

Questi dati non fanno parte del dataset degli articoli e non devono necessariamente essere persistiti in IndexedDB.

Frequenza di aggiornamento e modalità di gestione della cache vengono definite in base alle caratteristiche della singola integrazione.

## Syntax highlighting e contenuti tecnici

La versione attuale del sito utilizza Prism per il syntax highlighting.

Per la nuova versione sono state valutate principalmente:

- Prism;
- Highlight.js;
- Shiki.

### Prism

Prism è già utilizzato nella versione attuale e rappresenta quindi la soluzione con il minor costo di migrazione.

Permette di caricare selettivamente i linguaggi necessari e dispone di un ecosistema consolidato di plugin.

### Highlight.js

Highlight.js offre un approccio simile a Prism e supporta un ampio numero di linguaggi.

Può utilizzare il linguaggio dichiarato esplicitamente oppure tentare il riconoscimento automatico.

Poiché Appunti Digitali conosce già il linguaggio associato a ciascun blocco di codice, il riconoscimento automatico non costituisce un requisito.

### Shiki

Shiki utilizza grammatiche TextMate compatibili con quelle utilizzate da VS Code e offre un syntax highlighting particolarmente accurato.

Può produrre HTML oppure una rappresentazione strutturata del codice, rendendo possibili trasformazioni più avanzate.

Richiede tuttavia una gestione più complessa rispetto a Prism, soprattutto per inizializzazione, caricamento dei linguaggi e utilizzo nel browser.

### Scelta della libreria

La scelta è stata effettuata considerando:

- supporto per HTML, CSS, JavaScript, TypeScript, PHP, Twig, YAML, JSON, SQL e Bash;
- dimensione del bundle;
- caricamento selettivo dei linguaggi;
- compatibilità con Angular;
- facilità di applicazione dopo il rendering del body HTML;
- possibilità di mantenere l'evidenziazione delle occorrenze della ricerca all'interno dei blocchi di codice;
- accessibilità;
- qualità e personalizzazione dei temi;
- costo di migrazione rispetto alla soluzione attuale.

Sulla base di questi criteri è stato deciso di mantenere Prism.

Prism supporta tutti i linguaggi e formati attualmente previsti dal progetto e si integra già correttamente con l'identità visiva del sito.

La migrazione verso una libreria differente non offre al momento un vantaggio sufficiente a giustificare il costo di sostituzione.

Durante l'implementazione deve essere verificata in particolare la convivenza tra il markup generato da Prism e l'evidenziazione delle occorrenze della ricerca all'interno dei blocchi di codice.

Se questa integrazione dovesse evidenziare limiti non risolvibili in modo semplice, la scelta della libreria potrà essere rivalutata.

### Integrazione con Drupal e CKEditor

La versione attuale utilizza CodeSnippet per l'inserimento dei blocchi di codice e CodeMirror per la modifica del codice sorgente dell'articolo.

In Drupal 11 il precedente CodeSnippet viene sostituito dal Code Block integrato in CKEditor 5.

Prism rimane responsabile del syntax highlighting nel frontend Angular, mentre Drupal deve produrre e conservare un markup portabile basato su `pre`, `code` e sull'identificazione del linguaggio.

Durante l'implementazione devono essere verificati in particolare:

- compatibilità con il Code Block standard di CKEditor 5;
- migrazione dei code block esistenti;
- conservazione del markup dei blocchi di codice;
- corrispondenza tra gli identificatori dei linguaggi utilizzati da Drupal e quelli riconosciuti da Prism.

## Embed esterni

Gli articoli possono contenere embed provenienti da servizi esterni quando aggiungono un valore che non può essere ottenuto con un normale blocco di codice statico.

Gli embed devono rimanere elementi secondari rispetto al contenuto dell'articolo e non devono essere necessari per comprenderne le informazioni principali.

### CodePen

CodePen viene utilizzato per mostrare esempi frontend interattivi.

Il suo utilizzo è previsto principalmente per:

- HTML;
- CSS;
- JavaScript;
- TypeScript;
- preprocessori e varianti supportati da CodePen, quando utili all'esempio.

CodePen non viene utilizzato come playground generale per linguaggi backend o di configurazione come PHP, Twig, YAML, SQL o Bash.

Per questi linguaggi vengono utilizzati normali blocchi di codice statici con syntax highlighting.

Quando possibile, l'articolo mantiene anche una rappresentazione statica del codice significativo mostrato nel Pen.

Questo permette di:

- rendere il contenuto leggibile anche se l'embed non viene caricato;
- mantenere il codice disponibile alla ricerca client-side;
- evitare che un servizio esterno diventi necessario per consultare
  l'articolo.

### Indicizzazione degli embed

Il contenuto interno degli embed CodePen non viene inserito nell'indice di ricerca.

Il codice rilevante deve essere indicizzato attraverso i normali blocchi di codice statici presenti nell'articolo.

Questa scelta evita:

- duplicazione delle occorrenze nei risultati;
- dipendenza dalla struttura HTML interna generata da CodePen;
- necessità di accedere al contenuto di iframe appartenenti a domini esterni.

Il contenitore dell'embed può comunque far parte della struttura dell'articolo,
ma il contenuto remoto non viene trattato come `SearchSegment`.

### Link alla risorsa originale

Quando disponibile deve essere presente un collegamento alla risorsa originale sul servizio esterno.

Il link permette di:

- aprire l'esempio direttamente sul provider;
- utilizzare le funzionalità complete del playground;
- accedere alla risorsa anche quando l'embed non viene visualizzato correttamente.

### Caricamento

Gli embed esterni non devono rallentare inutilmente il caricamento iniziale dell'articolo.

Quando tecnicamente possibile vengono caricati solo quando il relativo contenuto è vicino alla viewport oppure quando è necessario mostrarlo.

Il caricamento dell'embed non deve bloccare:

- rendering dell'articolo;
- costruzione dell'indice di ricerca;
- syntax highlighting dei blocchi statici;
- utilizzo delle altre parti dell'interfaccia.

Un embed viene quindi considerato una risorsa autonoma e opzionale.

### Gestione degli errori

Il fallimento del caricamento di un embed non deve rendere inutilizzabile l'articolo.

Se il provider esterno non è disponibile, l'interfaccia deve poter mostrare:

- un messaggio di stato;
- il collegamento alla risorsa originale, quando disponibile;
- l'eventuale blocco di codice statico equivalente presente nell'articolo.

Non viene utilizzato un errore globale della pagina per il fallimento di un singolo embed.

### Responsive

Gli embed devono adattarsi alla larghezza disponibile senza provocare overflow dell'intera pagina.

Il contenitore dell'embed deve quindi gestire correttamente:

- larghezza disponibile;
- altezza minima necessaria;
- comportamento su mobile;
- eventuale scrolling interno fornito dal provider.

Le dimensioni definitive vengono adattate al singolo tipo di embed.

### Sicurezza

Gli embed esterni vengono trattati come contenuti provenienti da domini di terze parti.

Non devono essere eseguiti script arbitrari inseriti direttamente nel body dell'articolo quando può essere utilizzato un meccanismo di embed controllato, ad esempio tramite `iframe`.

La configurazione della Content Security Policy deve autorizzare esclusivamente i provider effettivamente utilizzati dal sito.

Eventuali attributi di sicurezza e restrizioni disponibili per gli iframe devono essere configurati con il livello minimo di permessi necessario al funzionamento dell'embed.

### Privacy

Gli embed esterni possono causare richieste verso servizi di terze parti e potrebbero comportare il trattamento di dati da parte del relativo provider.

Prima di integrare un nuovo servizio deve quindi essere verificato:

- quali risorse esterne vengono caricate;
- se vengono utilizzati cookie o altri meccanismi di tracciamento;
- se il caricamento può avvenire direttamente oppure deve essere subordinato a una scelta dell'utente;
- se è disponibile una modalità di embed più rispettosa della privacy.

La decisione viene presa per ciascun provider e non viene generalizzata a tutti gli embed.

### Informazioni di compatibilità

Servizi informativi come Can I Use possono essere utilizzati per mostrare informazioni di compatibilità quando l'embed aggiunge valore rispetto a un semplice collegamento esterno.

Anche questi contenuti vengono considerati opzionali e non fanno parte dell'indice di ricerca.

Se l'embed risulta troppo pesante o interrompe eccessivamente il flusso di lettura può essere sostituito da un link contestuale alla risorsa originale.

### Altri playground

L'eventuale introduzione futura di altri playground, ad esempio StackBlitz o strumenti dedicati a linguaggi backend, viene valutata separatamente.

Un nuovo provider viene introdotto solo se offre una funzionalità realmente utile rispetto ai blocchi di codice statici già disponibili e se può essere integrato senza compromettere:

- performance;
- accessibilità;
- sicurezza;
- privacy;
- funzionamento della ricerca.

## Home e integrazioni esterne

La home page mostra contenuti provenienti da sorgenti differenti:

- feed RSS;
- Stack Overflow;
- repository GitHub starred;
- risorse salvate tramite web clipper.

Queste sezioni sono indipendenti dal contenuto principale del sito.

Gli articoli tecnici rappresentano il contenuto essenziale di Appunti Digitali; il mancato caricamento di una o più sezioni della home non deve quindi impedire la consultazione del sito.

### Mediazione tramite Drupal

Nella nuova versione Angular non interroga direttamente le API di GitHub e Stack Overflow.

Le integrazioni esterne vengono mediate dal backend Drupal.

Il flusso generale diventa:

    servizio esterno
        ↓
    Drupal
        ↓
    cache / normalizzazione
        ↓
    API Appunti Digitali
        ↓
    Angular

Questa scelta permette di:

- centralizzare la gestione delle integrazioni esterne;
- evitare problemi CORS nel frontend;
- gestire eventuali credenziali esclusivamente lato server;
- controllare rate limit e frequenza delle richieste;
- applicare una cache condivisa;
- fornire ad Angular un contratto stabile indipendente dalle API esterne;
- evitare che il browser dell'utente debba contattare direttamente i provider;
- semplificare il rendering server-side della home.

Angular non deve quindi conoscere direttamente la struttura delle response GitHub o Stack Overflow.

Drupal trasforma, quando necessario, i dati esterni nel formato richiesto dal frontend.

### Feed RSS

I feed RSS continuano a essere recuperati da Drupal.

Drupal ha la responsabilità di:

- interrogare le sorgenti RSS configurate;
- conservare temporaneamente i dati recuperati;
- esporre al frontend le notizie attraverso la relativa API.

Angular utilizza esclusivamente i dati esposti da Drupal e non contatta direttamente le sorgenti RSS.

Il recupero dei feed non deve essere eseguito nuovamente per ogni visita alla home.

### Stack Overflow

Drupal recupera da Stack Overflow i dati necessari alla relativa sezione della home.

L'integrazione deve tenere conto delle quote e dei meccanismi di throttling previsti dall'API.

Le richieste non devono quindi essere effettuate a ogni caricamento della pagina, ma devono utilizzare una cache lato backend.

Drupal espone ad Angular soltanto i campi effettivamente necessari all'interfaccia.

La cache viene aggiornata periodicamente tramite cron Drupal.

Se l'aggiornamento fallisce, viene mantenuto l'ultimo risultato valido disponibile.

### GitHub

Drupal recupera tramite le API GitHub i repository starred necessari alla home.

Anche questa integrazione utilizza una cache lato backend per evitare richieste ripetute e ridurre il consumo del rate limit.

Quando supportato dall'endpoint utilizzato possono essere sfruttati anche i meccanismi HTTP di validazione della cache, come `ETag` e richieste condizionali.

Se in futuro fosse necessario utilizzare un token GitHub, questo verrebbe conservato esclusivamente nel backend e non incluso nel bundle Angular.

La cache viene aggiornata periodicamente tramite cron Drupal.

Se l'aggiornamento fallisce, viene mantenuto l'ultimo risultato valido disponibile.

### Risorse salvate

Le risorse salvate tramite web clipper sono contenuti Drupal e non dipendono da un servizio esterno durante la consultazione della home.

Angular le recupera attraverso le API Drupal previste per i contenuti pubblici.

Anche se appartengono al sito, la loro visualizzazione nella home è considerata funzionalmente opzionale: un errore nel recupero delle risorse salvate non deve impedire la consultazione degli articoli.

### Strategia di cache

Feed RSS, Stack Overflow e GitHub utilizzano cache indipendenti lato Drupal.

La frequenza di aggiornamento della cache può essere differente per ciascuna integrazione e viene definita durante l'implementazione in base a:

- frequenza con cui il dato cambia;
- limiti imposti dal provider;
- costo della richiesta;
- utilità di avere dati aggiornati in tempo reale.

Questi contenuti non richiedono aggiornamento in tempo reale.

Angular può mantenere in memoria i dati già recuperati durante la sessione, ma non viene prevista inizialmente la loro persistenza in IndexedDB.

IndexedDB rimane dedicato principalmente alle aree tematiche e ai dataset degli articoli necessari alla ricerca e alla consultazione del sito.

### Rate limit

GitHub e Stack Overflow applicano limiti e meccanismi di protezione alle rispettive API.

I valori specifici dei limiti non vengono incorporati nell'architettura perché possono cambiare nel tempo.

L'implementazione deve invece:

- limitare il numero di richieste tramite cache;
- rispettare eventuali indicazioni di `Retry-After`, `backoff` o equivalenti;
- evitare retry aggressivi;
- gestire esplicitamente le risposte dovute al superamento dei limiti.

La configurazione effettiva viene verificata contro la documentazione corrente dei provider durante l'implementazione.

### Gestione degli errori

Ogni integrazione deve poter fallire indipendentemente dalle altre.

Se una sorgente non è disponibile:

1. se è presente una copia cache valida o comunque utilizzabile, Drupal può continuare a fornire l'ultimo dato disponibile;
2. in assenza di dati utilizzabili, Angular mostra lo stato di errore della sola sezione interessata;
3. quando appropriato viene mostrata un'azione `Riprova`.

Ad esempio, un errore GitHub non deve impedire di visualizzare:

- articoli;
- feed RSS;
- Stack Overflow;
- risorse salvate.

Non viene effettuato un reload dell'intera home per ripetere una singola integrazione.

### Privacy

Le chiamate ai servizi esterni vengono effettuate dal backend Drupal e non direttamente dal browser dell'utente.

La consultazione normale della home non richiede quindi al browser di contattare GitHub, Stack Overflow o le sorgenti RSS.

Questa architettura riduce l'esposizione dei visitatori ai servizi di terze parti e centralizza nel backend il controllo delle integrazioni esterne.

Gli embed esplicitamente presenti negli articoli, come CodePen, costituiscono un caso distinto e vengono gestiti secondo le regole definite nella sezione
dedicata agli embed esterni.

## Web clipper

Il web clipper è un'estensione Chrome utilizzata dall'amministratore per salvare rapidamente una pagina web tra le risorse di Appunti Digitali.

L'estensione costituisce un client separato sia dal frontend Angular sia dall'interfaccia amministrativa Drupal.

Il flusso generale è:

    pagina web aperta nel browser
        ↓
    estensione Chrome
        ↓
    recupero di titolo e URL
        ↓
    POST verso Drupal
        ↓
    validazione e autenticazione
        ↓
    creazione della risorsa salvata

Angular non interviene nel processo di creazione della risorsa.

Le risorse create vengono successivamente esposte al frontend attraverso le normali API pubbliche Drupal e mostrate nella relativa sezione della home page.

### Dati salvati

Una risorsa contiene almeno:

- titolo della pagina;
- URL;
- eventuali tag associati dall'amministratore.

Il titolo può essere inizialmente ricavato dal titolo della pagina corrente, ma deve poter essere modificato se necessario.

L'URL rappresenta il dato principale della risorsa e deve essere validato prima della creazione del contenuto.

La tassonomia utilizzata per i tag è dedicata alle risorse salvate e rimane separata dalle aree tematiche degli articoli tecnici.

### Endpoint Drupal

La creazione delle risorse non viene affidata direttamente alle API pubbliche in sola lettura utilizzate da Angular.

Drupal espone invece un endpoint custom dedicato al web clipper.

Concettualmente la richiesta può avere una forma simile a:

    POST /api/resources

    {
      "title": "Titolo della pagina",
      "url": "https://example.com/",
      "tags": ["Drupal", "Angular"]
    }

L'endpoint ha la responsabilità di:

- autenticare il chiamante;
- verificare che disponga del permesso necessario;
- validare il payload;
- normalizzare i dati quando necessario;
- creare il contenuto Drupal;
- associare gli eventuali termini di tassonomia;
- restituire un risultato comprensibile all'estensione.

La struttura definitiva dell'endpoint e del payload verrà stabilita durante l'implementazione del backend.

### Autenticazione e autorizzazione

L'endpoint non è pubblico.

Solo l'amministratore deve poter creare risorse tramite il web clipper.

L'estensione deve quindi autenticarsi verso Drupal utilizzando una credenziale dedicata al servizio.

Non deve essere memorizzata nell'estensione la password dell'account amministratore Drupal.

La modalità definitiva di autenticazione deve permettere di:

- revocare la credenziale senza modificare la password dell'amministratore;
- limitare i privilegi alla sola funzionalità necessaria;
- trasmettere la credenziale esclusivamente tramite HTTPS;
- evitare che una compromissione dell'estensione conceda automaticamente accesso amministrativo completo a Drupal.

La scelta concreta del meccanismo di autenticazione verrà definita durante l'implementazione e potrà richiedere una configurazione o un modulo Drupal dedicato.

### Permessi dell'estensione

L'estensione deve richiedere soltanto i permessi necessari al proprio funzionamento.

L'azione viene avviata esplicitamente dall'amministratore mentre è aperta la pagina da salvare.

L'estensione necessita quindi principalmente di:

- leggere URL e titolo della pagina corrente;
- comunicare con il dominio Drupal configurato.

Non deve accedere al contenuto completo delle pagine visitate se tale accesso non è necessario alla funzionalità prevista.

### CORS

Poiché l'estensione e Drupal hanno origini differenti, deve essere configurata esplicitamente la possibilità per l'estensione di comunicare con l'endpoint Drupal.

La configurazione CORS deve essere limitata alle origini effettivamente necessarie e non deve rendere genericamente accessibili gli endpoint amministrativi.

Le API pubbliche utilizzate da Angular e l'endpoint di scrittura utilizzato dal web clipper possono quindi avere politiche di accesso differenti.

### Validazione

Drupal rimane responsabile della validazione finale dei dati.

In particolare devono essere verificati almeno:

- presenza dell'URL;
- validità del formato dell'URL;
- presenza del titolo;
- formato dei tag;
- autorizzazione dell'utente.

La validazione effettuata dall'estensione ha finalità principalmente ergonomiche e non sostituisce quella lato backend.

### Risorse duplicate

Prima della creazione può essere verificato se esiste già una risorsa con lo stesso URL.

La gestione definitiva dei duplicati verrà definita durante l'implementazione.

Le possibili strategie sono:

- impedire la creazione di un duplicato;
- segnalare all'amministratore che la risorsa esiste già;
- consentire esplicitamente la creazione di più risorse con lo stesso URL.

La scelta deve evitare duplicazioni involontarie senza impedire eventuali casi in cui lo stesso URL debba essere classificato in modi differenti.

### Feedback dell'estensione

Dopo l'invio della richiesta l'estensione deve mostrare un feedback chiaro.

Devono essere distinguibili almeno gli stati:

    idle
      ↓
    salvataggio
      ↓
    successo

oppure:

    salvataggio
      ↓
    errore
      ↓
    nuovo tentativo

In caso di successo deve essere comunicato che la risorsa è stata salvata.

In caso di errore deve essere mostrato un messaggio comprensibile senza esporre direttamente dettagli tecnici provenienti dal backend.

Il fallimento della richiesta non deve chiudere automaticamente l'interfaccia dell'estensione, in modo da permettere un nuovo tentativo.

### Configurazione

L'URL del backend Drupal non deve essere duplicato in più punti del codice dell'estensione.

Deve essere mantenuto in una configurazione dedicata, in modo da poter distinguere almeno l'ambiente di sviluppo dall'ambiente di produzione.

Le credenziali utilizzate per autenticare il web clipper non devono essere versionate nel repository pubblico.

### Sicurezza

L'endpoint del web clipper rappresenta una superficie di scrittura sul CMS e deve quindi essere mantenuto separato dalle API pubbliche in sola lettura.

La sicurezza si basa almeno su:

- comunicazione HTTPS;
- autenticazione obbligatoria;
- permesso Drupal specifico;
- validazione server-side;
- privilegio minimo della credenziale utilizzata;
- configurazione CORS restrittiva;
- nessuna password amministrativa memorizzata nell'estensione.

L'estensione non deve poter creare o modificare tipi di contenuto differenti dalle risorse previste dal web clipper.

## Loading, error handling e stato dell'interfaccia

L'interfaccia deve rimanere utilizzabile anche quando alcune sorgenti dati sono ancora in caricamento oppure non sono temporaneamente disponibili.

Non viene adottato un unico stato globale dell'applicazione che blocca l'interfaccia fino al completamento di tutte le richieste.

### Loading progressivo

L'application shell viene mostrata il prima possibile.

Le singole aree che dipendono da dati asincroni gestiscono autonomamente il proprio stato di caricamento.

Questo riguarda in particolare:

- caricamento degli articoli;
- costruzione dell'indice di ricerca;
- profilo pubblico;
- feed RSS;
- Stack Overflow;
- GitHub;
- risorse salvate;
- eventuali embed esterni.

Il caricamento di una sezione non deve impedire l'utilizzo delle altre parti dell'interfaccia quando queste sono già disponibili.

### Indicatore di caricamento

Gli stati di loading utilizzano il pattern grafico definito nel design system, basato su una piccola animazione ispirata a una matita che scrive.

Lo stesso pattern può essere riutilizzato in contesti differenti adattandone:

- dimensione;
- posizione;
- eventuale testo associato.

L'indicatore deve essere discreto e non deve sostituire inutilmente contenuti che possono essere già mostrati.

Le animazioni devono rispettare `prefers-reduced-motion`.

### Stati locali delle feature

Ogni feature asincrona deve poter rappresentare almeno i seguenti stati:

    idle
    loading
    success
    error

Quando utile può essere previsto anche uno stato intermedio di dati disponibili ma in aggiornamento.

Ad esempio, quando sono già presenti articoli provenienti da IndexedDB e viene verificata la disponibilità di una versione più recente su Drupal, il sito può continuare a utilizzare i dati esistenti senza tornare a uno stato di loading bloccante.

### Errori locali

Gli errori devono essere isolati alla funzionalità che li ha generati.

Il mancato caricamento di GitHub, Stack Overflow, feed RSS o di un embed esterno non deve produrre un errore globale dell'applicazione.

Quando una sorgente non è essenziale il resto del sito continua a funzionare normalmente.

Ogni sezione in errore può mostrare:

- un messaggio sintetico;
- un'indicazione visiva non basata esclusivamente sul colore;
- un'azione `Riprova` quando la richiesta può essere eseguita nuovamente.

I messaggi destinati all'utente non devono mostrare direttamente stack trace, status tecnici o messaggi grezzi restituiti dal backend.

### Errori essenziali

Gli articoli rappresentano il contenuto principale del sito.

Se non è possibile recuperarli da Drupal ma è disponibile una copia valida in IndexedDB, il frontend può continuare a utilizzare la cache locale.

Se non è disponibile né il backend né una copia locale utilizzabile, la parte del sito che dipende dagli articoli non può funzionare correttamente e deve mostrare uno stato di errore esplicito.

Anche in questo caso l'application shell deve rimanere disponibile e non deve essere sostituita da una pagina di errore tecnica.

Le richieste degli articoli delle diverse aree sono indipendenti.

Il fallimento del caricamento di una singola area non deve invalidare i dati recuperati correttamente per le altre aree.

Quando possibile, ogni area mantiene una propria copia valida in IndexedDB.

Se, ad esempio, la richiesta relativa a JavaScript fallisce ma le altre aree sono disponibili, il frontend continua a utilizzare normalmente HTML, CSS, Angular, PHP, Drupal e Varie.

Se per l'area non raggiungibile è disponibile una copia precedentemente valida in IndexedDB, questa può essere utilizzata come fallback.

Il retry riguarda soltanto la richiesta dell'area che ha prodotto l'errore.

### Retry

Il retry deve essere limitato alla richiesta che ha prodotto l'errore.

Ad esempio:

- errore GitHub → viene ripetuta solo la richiesta relativa alla sezione GitHub;
- errore Stack Overflow → viene ripetuta solo la richiesta relativa alla sezione Stack Overflow;
- errore feed RSS → viene ripetuto solo il recupero del feed;
- errore articoli di un'area → viene ripetuta soltanto la richiesta relativa all'area interessata.

Non viene normalmente effettuato un reload completo dell'applicazione per recuperare da un errore locale.

### Stato della ricerca

Lo stato della ricerca viene gestito autonomamente dalla feature `search`, secondo quanto definito nella sezione dedicata.

La preparazione dell'indice non blocca l'interfaccia e, se l'utente ha già inserito una query, questa viene eseguita automaticamente quando l'indice diventa disponibile.

### Aggiornamento dei dati

Quando sono già presenti dati validi nell'interfaccia, un aggiornamento non deve necessariamente sostituirli con un loader.

Quando possibile viene adottato un comportamento simile a:

    dati disponibili
        +
    aggiornamento in background

anziché:

    contenuto vuoto
        +
    loader

Se l'aggiornamento ha successo, i dati vengono sostituiti con la nuova versione.

Se l'aggiornamento fallisce ma i dati precedenti sono ancora utilizzabili, questi possono rimanere visibili e l'errore può essere comunicato in modo non bloccante.

### Feedback delle azioni

Le azioni dell'utente devono fornire un feedback immediato quando il risultato non è già evidente dall'interfaccia.

Questo riguarda ad esempio:

- copia di un blocco di codice;
- copia dell'indirizzo email;
- retry di una richiesta;
- salvataggio tramite web clipper.

I feedback positivi devono essere brevi e non invasivi.

Gli stati di successo ed errore non devono essere comunicati esclusivamente tramite il colore.

### Gestione tecnica degli errori

I servizi che effettuano richieste HTTP devono distinguere almeno:

- errore di rete;
- risposta HTTP non valida;
- risposta valida ma non conforme al contratto atteso.

I dettagli tecnici possono essere utilizzati per logging e debugging ma non devono essere mostrati direttamente nell'interfaccia pubblica.

La gestione visuale dell'errore rimane responsabilità della feature che utilizza il dato, in modo da poter mostrare un messaggio coerente con il contesto.


## Accessibilità, performance, SEO e sicurezza

Le scelte tecniche del frontend devono preservare accessibilità, performance, indicizzazione dei contenuti e sicurezza senza compromettere la natura decoupled dell'applicazione.

### Accessibilità

L'interfaccia deve poter essere utilizzata tramite tastiera e tecnologie assistive anche quando sono presenti componenti dinamici.

Devono essere rispettati almeno i seguenti principi:

- utilizzo di HTML semantico;
- struttura corretta degli heading;
- nome accessibile per controlli rappresentati soltanto tramite icone;
- focus da tastiera chiaramente visibile;
- gestione esplicita del focus per drawer, overlay dei risultati e navigazione verso una SearchOccurrence;
- target interattivi sufficientemente ampi;
- contenuti comprensibili anche senza fare affidamento esclusivamente sul colore;
- testi alternativi appropriati per le immagini informative;
- immagini decorative ignorate dalle tecnologie assistive;
- tabelle con struttura semantica corretta;
- code block e codice inline leggibili e selezionabili;
- rispetto di `prefers-reduced-motion`.

La search bar deve avere un nome accessibile anche se non utilizza una label visibile.

Il drawer mobile deve gestire correttamente apertura, chiusura, focus e ritorno del focus al controllo che lo ha aperto.

L'overlay dei risultati deve essere navigabile tramite tastiera e le singole occorrenze devono essere elementi interattivi riconoscibili.

Il feedback sonoro rimane sempre aggiuntivo rispetto al feedback visivo e non deve trasmettere informazioni disponibili esclusivamente tramite audio.

### Performance

La strategia di performance deve privilegiare il caricamento rapido della struttura principale e ridurre il lavoro non necessario durante la normale consultazione.

Le principali strategie previste sono:

- application shell disponibile il prima possibile;
- caricamento indipendente delle diverse sezioni;
- utilizzo della cache IndexedDB per le aree tematiche e i dataset degli articoli;
- validazione della cache tramite meccanismi HTTP quando disponibili;
- costruzione dell'indice di ricerca una sola volta per ogni versione del dataset;
- nessuna richiesta al backend durante la digitazione nella ricerca;
- lazy loading degli embed esterni quando possibile;
- caricamento selettivo dei linguaggi Prism necessari;
- lazy loading delle feature Angular quando produce un beneficio reale;
- ottimizzazione delle immagini;
- caching appropriato degli asset statici.

La dimensione effettiva del dataset completo degli articoli deve essere misurata sui contenuti reali.

Il recupero del contenuto completo degli articoli rimane la soluzione preferita, ma avviene tramite dataset separati per area.

Devono essere misurati sia il peso complessivo dei dati sia il peso e i tempi di caricamento delle singole aree.

Anche costruzione dell'indice e tempi di ricerca devono essere misurati sul dataset reale prima di introdurre ottimizzazioni più complesse.

Web Worker, persistenza dell'indice o librerie di ricerca specializzate vengono considerati solo se le misurazioni mostrano un problema concreto.

### Metriche di performance e Core Web Vitals

Le decisioni relative alle performance devono essere verificate tramite misurazioni e non soltanto sulla base di valutazioni teoriche.

Devono essere monitorati in particolare i Core Web Vitals:

- Largest Contentful Paint (LCP), relativo alla velocità con cui viene visualizzato il principale contenuto della pagina;
- Interaction to Next Paint (INP), relativo alla reattività dell'interfaccia alle interazioni dell'utente;
- Cumulative Layout Shift (CLS), relativo alla stabilità visuale dell'interfaccia durante il caricamento.

Vengono inoltre considerate altre metriche utili alla diagnosi delle performance, tra cui:

- First Contentful Paint (FCP);
- Time to First Byte (TTFB).

Queste metriche vengono utilizzate per verificare in particolare:

- efficacia del server-side rendering;
- velocità di risposta del frontend SSR e delle API Drupal;
- peso del dataset iniziale degli articoli;
- tempo necessario al rendering della pagina;
- impatto della costruzione dell'indice di ricerca;
- caricamento di immagini, font ed embed;
- stabilità del layout durante il caricamento progressivo delle sezioni.

Le misurazioni vengono effettuate sia in ambiente di sviluppo sia sul sito pubblicato.

Durante lo sviluppo possono essere utilizzati strumenti come:

- Chrome DevTools;
- Lighthouse;
- PageSpeed Insights.

Dopo la pubblicazione devono essere considerate anche misurazioni basate sull'esperienza reale degli utenti, quando disponibili.

Gli eventuali problemi rilevati vengono ottimizzati sulla base della metrica interessata, evitando ottimizzazioni premature non supportate da misurazioni.

### Strategia di rendering Angular

Le pagine pubbliche contenenti informazioni indicizzabili non devono dipendere esclusivamente dal rendering client-side.

Viene quindi previsto l'utilizzo delle funzionalità di server-side rendering di Angular per le route pubbliche principali.

In particolare devono poter essere restituite dal server già complete almeno:

- home page;
- pagine degli articoli.

Le funzionalità esclusivamente interattive continuano invece a essere gestite nel browser, tra cui:

- ricerca client-side;
- IndexedDB;
- gestione dello stato della ricerca;
- evidenziazione delle occorrenze;
- interazioni con sidebar e drawer.

L'HTML generato lato server viene successivamente reso interattivo da Angular nel browser.

Non viene scelto come strategia principale il prerendering statico di tutti gli articoli, perché i contenuti Drupal devono poter essere aggiornati indipendentemente dal deploy del frontend.

Il server-side rendering permette invece di generare la versione HTML corrente dell'articolo al momento della richiesta senza richiedere un nuovo build Angular dopo ogni modifica editoriale.

Le route pubbliche principali utilizzano il server-side rendering di Angular 22.
La configurazione corrente utilizza il rendering server-side dinamico, senza prerendering statico delle route.

### SEO

Ogni articolo deve disporre di un URL pubblico stabile e leggibile.

Gli URL pubblici appartengono al frontend Angular e non devono dipendere da identificativi interni o percorsi amministrativi Drupal.

Per ogni pagina indicizzabile devono essere definiti almeno:

- `<title>` specifico;
- meta description appropriata;
- URL canonical;
- struttura semantica degli heading;
- attributo `lang` del documento;
- metadata utili alla condivisione social quando previsti.

Il titolo dell'articolo rappresenta l'`h1` della pagina.

Il nome Appunti Digitali presente nell'header mantiene funzione di branding e non deve introdurre un secondo `h1`.

Le pagine articolo devono essere disponibili ai crawler attraverso HTML renderizzato lato server anche quando JavaScript non viene eseguito completamente.

La ricerca interna e il relativo overlay non costituiscono pagine da indicizzare.

### Dati strutturati

Il sito utilizza dati strutturati Schema.org in formato JSON-LD.

#### WebSite

La home page espone un oggetto `WebSite` per descrivere il sito nel suo complesso.

Il markup può includere almeno:

- nome del sito;
- URL canonico;
- eventuale nome alternativo.

#### Person

La sezione pubblica dedicata all'amministratore utilizza un oggetto `Person`.

Il markup può includere almeno:

- nome;
- URL del sito;
- avatar;
- ruolo professionale;
- profilo LinkedIn;
- profilo GitHub.

I profili esterni vengono rappresentati tramite `sameAs`.

#### Article

Ogni pagina articolo espone dati strutturati di tipo `Article`.

Il markup può includere almeno:

- titolo;
- URL canonico;
- autore;
- area tematica;
- eventuale immagine.

L'autore viene collegato alla stessa entità `Person` utilizzata per il profilo dell'amministratore.

La proprietà `articleSection` può essere utilizzata per rappresentare l'area tematica dell'articolo, ad esempio `Drupal`, `Angular`, `PHP` o `JavaScript`.

Non vengono esposte `datePublished` e `dateModified`, perché gli articoli non utilizzano attualmente un modello editoriale basato su una data di pubblicazione significativa.

#### Tipi non utilizzati

`ProfilePage` non viene utilizzato sulla home perché il profilo dell'amministratore non rappresenta l'unico contenuto principale della pagina.

`BreadcrumbList` non viene introdotto finché il sito non utilizza breadcrumb visibili nell'interfaccia.

Non vengono aggiunti altri tipi Schema.org se non corrispondono a contenuti o funzionalità realmente presenti nel sito.

### Microformats

È stato valutato anche l'utilizzo di microformats2 (`h-card`, `h-entry`) per descrivere profilo e articoli direttamente nel markup HTML.

Non vengono introdotti nella prima versione perché le esigenze di dati strutturati del sito sono già coperte tramite Schema.org in formato JSON-LD, mentre non sono previste integrazioni che richiedano specificamente
microformats.

La loro introduzione futura rimane possibile senza modificare il modello dei contenuti.

### Open Graph

Le pagine pubbliche espongono metadati Open Graph per controllare la presentazione dei link quando vengono condivisi su servizi che supportano questo protocollo.

Per la home page vengono definiti almeno:

- `og:title`;
- `og:description`;
- `og:url`;
- `og:image`;
- `og:type` con valore `website`;
- `og:site_name`.

Per le pagine articolo vengono definiti almeno:

- `og:title`;
- `og:description`;
- `og:url`;
- `og:image`;
- `og:type` con valore `article`;
- `og:site_name`.

Inizialmente può essere utilizzata un'immagine Open Graph comune a tutto il sito, senza introdurre un campo immagine dedicato per ciascun articolo.

I metadati Open Graph devono essere generati coerentemente con URL canonico, titolo e contenuto della pagina renderizzata.

### Sitemap

Deve essere generata automaticamente una sitemap XML contenente gli URL pubblici degli articoli.

La sitemap deve utilizzare gli URL canonici del frontend Angular e non gli URL interni dei nodi Drupal.

Drupal rimane la sorgente delle informazioni necessarie alla generazione della sitemap, perché conosce l'insieme dei contenuti pubblicati.

La modalità concreta di generazione verrà definita durante l'implementazione.

Può essere valutato il modulo Drupal `Simple XML Sitemap`, che supporta Drupal 11 e permette di includere entità, Views e link custom, oppure una generazione dedicata coerente con gli URL pubblici del frontend.

La sitemap deve aggiornarsi in seguito alla pubblicazione, modifica o rimozione dei contenuti senza richiedere una modifica manuale dell'elenco degli URL.

Deve inoltre essere disponibile un file `robots.txt` coerente con la struttura pubblica del sito.

### Google Search Console

Il sito viene registrato in Google Search Console per monitorare la presenza delle pagine nella Ricerca Google.

Search Console viene utilizzata in particolare per:

- verificare lo stato di indicizzazione delle pagine;
- controllare eventuali errori di crawling;
- inviare e verificare la sitemap XML;
- verificare gli URL pubblici;
- monitorare query, impression e click provenienti dalla Ricerca Google.

Search Console non richiede l'inserimento di un sistema di analytics nel frontend e non viene utilizzata per tracciare la navigazione interna degli utenti.

### Google Tag Manager

Google Tag Manager non viene introdotto nella prima versione.

Il progetto non utilizza sistemi pubblicitari, remarketing o analytics che richiedano la gestione dinamica di più tag.

Evitare Tag Manager riduce inoltre il numero di script di terze parti e la complessità relativa a privacy e gestione del consenso.

La sua introduzione futura potrà essere valutata solo se emergerà una necessità concreta di gestire più strumenti di misurazione o servizi esterni.

### Sicurezza del frontend pubblico

Le API pubbliche Drupal utilizzate da Angular devono essere in sola lettura.

Il frontend non deve disporre di credenziali amministrative né di segreti necessari alla gestione del CMS.

Qualsiasi valore incluso nel bundle Angular deve essere considerato pubblico.

Le operazioni di scrittura devono essere esposte esclusivamente attraverso endpoint specificamente autorizzati, come quello previsto per il web clipper.

### Content Security Policy

La Content Security Policy deve essere configurata secondo il principio del minimo privilegio.

Devono essere autorizzate esclusivamente le sorgenti realmente necessarie per:

- applicazione Angular e relativi asset;
- Drupal API;
- immagini;
- font;
- CodePen e altri provider o risorse esterne effettivamente caricati dal browser.

L'introduzione di un nuovo provider esterno deve comportare una verifica della CSP necessaria e non un ampliamento indiscriminato delle sorgenti consentite.

### Comunicazioni e CORS

Tutte le comunicazioni in produzione devono utilizzare HTTPS.

Drupal deve configurare CORS esclusivamente per le origini che devono realmente accedere alle API.

Le API pubbliche in lettura e gli endpoint autenticati, come quello del web clipper, possono richiedere politiche CORS differenti.

Non deve essere utilizzata una configurazione permissiva degli endpoint di scrittura soltanto per semplificare lo sviluppo.

### Dipendenze

Le dipendenze frontend e Drupal devono essere mantenute aggiornate e introdotte solo quando forniscono un vantaggio concreto.

Per i moduli Drupal contrib deve essere preferito, quando disponibile, software coperto dalla Drupal Security Advisory Policy.

Nel frontend devono essere evitate dipendenze non necessarie per funzionalità che possono essere realizzate in modo semplice con gli strumenti già forniti da Angular o dal browser.

### Dati personali

Il sito pubblico espone esclusivamente i dati dell'amministratore esplicitamente previsti dal progetto.

Non vengono introdotti account pubblici, profilazione degli utenti o funzionalità di commento.

L'eventuale introduzione futura di analytics, cookie non tecnici o nuovi servizi esterni richiederà una valutazione separata degli aspetti privacy e consenso.

## Configurazione, testing e confini con gli altri documenti

### Configurazione degli ambienti

Frontend Angular, backend Drupal e web clipper devono poter utilizzare configurazioni differenti tra ambiente locale e produzione senza richiedere modifiche manuali al codice sorgente.

La configurazione deve comprendere almeno:

- URL pubblico del frontend;
- URL del backend Drupal;
- endpoint delle API;
- eventuali URL dei servizi esterni;
- configurazioni relative agli embed;
- configurazioni specifiche del web clipper.

Le configurazioni non sensibili possono essere versionate nel repository.

Credenziali, token e altri segreti non devono invece essere inclusi nel codice sorgente o nei file pubblicati nel repository.

Nel frontend Angular deve essere considerato che qualsiasi valore incluso nel bundle distribuito al browser è accessibile pubblicamente e non può quindi essere utilizzato per conservare segreti.

Le configurazioni specifiche del deploy verranno approfondite nel documento dedicato al deploy.

### Configurazione Drupal locale

La configurazione Drupal distingue tra impostazioni condivise e impostazioni specifiche dell'ambiente.

`settings.php` contiene la configurazione condivisa e viene versionato.

`settings.ddev.php` contiene la configurazione generata automaticamente da DDEV per l'ambiente locale e non viene versionato.

`settings.local.php` contiene gli override destinati esclusivamente allo sviluppo locale e non viene versionato.

`settings.php` carica `settings.local.php` quando il file è presente.

L'ambiente locale può utilizzare logging più dettagliato e disabilitare l'aggregazione CSS/JavaScript, senza propagare tali impostazioni alla produzione.

Le cache Drupal non vengono disabilitate permanentemente come configurazione generale dello sviluppo. Quando necessario vengono utilizzati gli strumenti di sviluppo Drupal e la ricostruzione esplicita delle cache.

Credenziali, token e altri dati sensibili devono rimanere in configurazioni specifiche dell'ambiente e non devono essere esportati tramite Configuration Management.

Gli URL assoluti dipendenti dall'ambiente non devono essere salvati nella configurazione dei contenuti o delle aree quando possono essere derivati dalla richiesta corrente.

Ad esempio, la configurazione di un'area conserva `html.svg`, non `https://cms.appunti-digitali.it/.../html.svg`.

L'URL pubblico completo viene costruito dall'API a runtime, permettendo allo stesso codice di funzionare sia con il dominio DDEV locale sia con il dominio di produzione.

### Coding standards e qualità del codice Drupal

Il codice custom Drupal deve rispettare gli standard `Drupal` e `DrupalPractice`.

Il progetto utilizza `drupal/coder` come dipendenza di sviluppo e mantiene un ruleset condiviso nel file `backend/phpcs.xml.dist`.

PHP_CodeSniffer viene utilizzato per individuare violazioni degli standard:

    ddev exec ./vendor/bin/phpcs

PHP Code Beautifier and Fixer viene utilizzato per correggere automaticamente le violazioni supportate:

    ddev exec ./vendor/bin/phpcbf

I controlli vengono applicati al codice presente in `web/modules/custom`.

Un eventuale generatore automatico della documentazione PHP non viene introdotto in questa fase. La sua utilità verrà rivalutata quando il modulo custom conterrà un numero sufficiente di controller, servizi e altre classi da rendere utile una documentazione API generata.

### Testing

Il progetto prevede test a livelli differenti in base alla responsabilità della funzionalità.

#### Frontend Angular

I test frontend devono coprire principalmente:

- servizi di accesso ai dati;
- trasformazione delle response API nei modelli applicativi;
- segmentazione dei contenuti;
- normalizzazione utilizzata dalla ricerca;
- individuazione di tutte le occorrenze;
- generazione delle `SearchOccurrence`;
- gestione dello stato della ricerca;
- comportamento dei componenti con stati loading, success ed error;
- navigazione verso un'occorrenza;
- ritorno ai risultati;
- componenti e interazioni che presentano logica significativa.

Non è necessario introdurre test unitari per markup puramente presentazionale che non contiene comportamento rilevante.

Devono essere previsti anche test di integrazione o end-to-end per i flussi principali, ad esempio:

    apertura del sito
        ↓
    caricamento articoli
        ↓
    ricerca
        ↓
    selezione di un'occorrenza
        ↓
    apertura dell'articolo
        ↓
    evidenziazione
        ↓
    Torna ai risultati

Altri flussi da verificare includono:

- apertura diretta di un articolo;
- utilizzo della cache locale;
- comportamento in caso di API temporaneamente non disponibile;
- retry delle integrazioni esterne;
- apertura e chiusura della navigazione desktop e mobile.

#### Backend Drupal

I test Drupal devono concentrarsi soprattutto sulla logica custom introdotta dal progetto.

Devono essere verificati almeno:

- endpoint custom del web clipper;
- autenticazione e autorizzazione;
- validazione del payload;
- creazione delle risorse salvate;
- eventuali trasformazioni custom dei dati;
- accessibilità pubblica delle API previste;
- impossibilità di eseguire operazioni non autorizzate;
- salvataggio corretto dei third-party settings `area`, `icon` e `weight`;
- esclusione dei content type con `area = false`;
- ordinamento delle aree tramite `weight`;
- esposizione corretta di `id` e `label`;
- generazione corretta di `iconUrl`;
- corretto contratto della response dell'endpoint `/api/areas`;
- validazione dell'area richiesta da `/api/articles/{area}`;
- esclusione dei content type non configurati come area tematica;
- esclusione degli articoli non pubblicati;
- ordinamento degli articoli tramite `field_weight`;
- normalizzazione di body e link di approfondimento;
- corretto contratto della response di `/api/articles/{area}`.

Le configurazioni Drupal standard non richiedono necessariamente test custom per ogni dettaglio, salvo presenza di logica specifica del progetto.

#### Contratto API

Le API rappresentano il confine tra Drupal e Angular e devono quindi essere verificate anche dal punto di vista del contratto.

I test devono controllare che le response contengano i dati necessari al frontend e mantengano una struttura compatibile con i relativi mapper.

Una modifica del modello Drupal non deve propagarsi accidentalmente ai componenti Angular senza passare dal livello di trasformazione previsto.

### Automazione dei test

I test automatici devono poter essere eseguiti tramite i normali comandi dei rispettivi progetti senza dipendere dall'ambiente di sviluppo personale.

L'eventuale introduzione di una pipeline CI dovrà eseguire almeno i controlli automatici considerati essenziali prima dell'integrazione delle modifiche.

La configurazione concreta della CI verrà definita durante l'implementazione e non costituisce una decisione necessaria per questa analisi.

### Documentazione del codice Angular

Il frontend utilizza Compodoc per generare la documentazione tecnica a partire dal codice TypeScript e dai relativi docblock.

I nomi tecnici e gli identificatori del codice rimangono in inglese, mentre docblock e spiegazioni destinate alla documentazione vengono scritti in italiano.

La documentazione generata viene salvata in `frontend/documentation` e non viene versionata nel repository, perché può essere rigenerata dal codice sorgente.

### Confini dell'analisi tecnica

Questo documento descrive l'architettura e le principali decisioni tecniche della nuova versione di Appunti Digitali.

Non contiene invece il dettaglio operativo completo di attività che richiedono una documentazione specifica.

In particolare vengono trattati separatamente:

#### Migrazione

La migrazione dalla versione attuale a Drupal 11 avrà un documento dedicato.

Il documento di migrazione definirà almeno:

- migrazione dei content type;
- rimozione dei campi non più utilizzati;
- migrazione del body `Full HTML`;
- migrazione dei blocchi di codice;
- utenti e profilo;
- file e immagini;
- risorse salvate;
- URL e redirect eventualmente necessari;
- verifiche successive alla migrazione.

#### Deploy

La strategia di deploy verrà descritta separatamente.

Il relativo documento comprenderà almeno:

- pubblicazione indipendente di frontend e backend;
- domini e sottodomini;
- document root Drupal;
- configurazione HTTPS;
- configurazioni degli ambienti;
- cache;
- SSR Angular;
- gestione dei processi necessari al frontend;
- CORS e Content Security Policy;
- eventuali procedure di rollback.

### Decisioni architetturali

Le principali decisioni architetturali sono documentate direttamente nella presente analisi tecnica.

Non vengono introdotti ADR separati nella prima versione, per evitare duplicazioni documentali.

Un ADR potrà essere creato in futuro solo per decisioni particolarmente rilevanti che richiedano una motivazione autonoma o che debbano essere riesaminate indipendentemente dal resto dell'architettura.

### Documentazione come riferimento

Requisiti, analisi funzionale, analisi UX/UI, design system e analisi tecnica descrivono aspetti differenti dello stesso progetto e devono rimanere coerenti.

In caso di modifica significativa di un requisito o di una decisione architetturale devono essere aggiornati anche i documenti interessati, evitando che la documentazione descriva un comportamento differente da quello
effettivamente implementato.

## Verifiche tecniche da effettuare in implementazione

Alcune decisioni di dettaglio non possono essere definite in modo affidabile durante l'analisi tecnica perché dipendono dal comportamento del codice, dalla quantità reale dei contenuti o dalla configurazione dell'ambiente.

Questi punti devono essere verificati durante l'implementazione prima di considerare definitiva la relativa soluzione.

### Ricerca client-side

Devono essere verificati sul dataset reale:

- peso complessivo degli articoli recuperati da Drupal;
- tempo necessario per trasformare gli articoli in `SearchSegment`;
- tempo necessario per costruire la struttura utilizzata dalla ricerca;
- tempo necessario per eseguire una query;
- comportamento con query che producono un numero elevato di occorrenze;
- consumo di memoria del dataset e delle strutture derivate.

Deve essere definita sperimentalmente la soglia minima di caratteri a partire dalla quale viene eseguita la ricerca.

La valutazione deve considerare anche le query tecniche brevi, che possono avere significato anche con uno o due caratteri.

Deve inoltre essere verificato se sia utile introdurre un breve debounce durante la digitazione oppure se la ricerca risulti sufficientemente veloce da aggiornare i risultati senza ritardi artificiali.

La prima implementazione utilizza una soluzione di ricerca custom basata sui segmenti. Una libreria specializzata o un Web Worker vengono valutati solo se le misurazioni mostrano problemi reali di performance o reattività.

### Segmentazione, occorrenze ed evidenziazione

Devono essere verificati con articoli reali:

- corretta segmentazione di heading, paragrafi, liste, tabelle e code block;
- gestione del codice inline all'interno del testo;
- ricerca negli URL e nei link di approfondimento;
- generazione di tutte le occorrenze presenti nello stesso segmento;
- corretto mantenimento degli offset tra testo normalizzato e testo originale;
- generazione di snippet leggibili per testo normale e codice;
- collegamento stabile tra `SearchSegment` e relativo elemento DOM.

La navigazione verso una `SearchOccurrence` deve essere verificata sia su desktop sia su mobile, controllando in particolare:

- scroll verso il punto corretto;
- compensazione dell'header persistente;
- gestione del focus;
- più occorrenze presenti nello stesso segmento;
- comportamento dopo `Torna ai risultati`;
- comportamento con Back del browser.

### Prism e code block

Deve essere verificata la convivenza tra il markup generato da Prism e l'evidenziazione delle occorrenze della ricerca.

In particolare devono essere provati casi in cui:

- la query si trova interamente all'interno di un token Prism;
- la query attraversa più token;
- nello stesso blocco sono presenti più occorrenze;
- il blocco contiene caratteri speciali;
- l'evidenziazione della ricerca viene applicata dopo il syntax highlighting.

La scelta di mantenere Prism verrà rivalutata solo se questa integrazione presenta limiti non risolvibili in modo semplice.

Devono inoltre essere verificati sui linguaggi realmente utilizzati:

- caricamento selettivo delle grammatiche necessarie;
- label del linguaggio;
- pulsante di copia;
- comportamento delle righe lunghe;
- leggibilità su mobile.

### Cache e IndexedDB

Sul dataset reale devono essere verificati:

- dimensione occupata dalle aree e dagli articoli in IndexedDB;
- tempo di lettura e scrittura della cache;
- tempo necessario per costruire l'indice a partire dalla copia locale;
- comportamento con cache assente, non disponibile o corrotta;
- aggiornamento della cache delle aree;
- aggiornamento indipendente della cache degli articoli delle singole aree.

Non viene inizialmente persistito l'indice di ricerca.

La persistenza dell'indice viene valutata solo se la sua ricostruzione risulta significativamente costosa.

### Validazione HTTP della cache

Deve essere verificato il comportamento dell'endpoint `/api/areas` e degli endpoint Drupal degli articoli per area rispetto ai meccanismi HTTP di validazione della cache.

In particolare deve essere valutato il supporto effettivo di:

- `ETag`;
- `Last-Modified`;
- richieste condizionali;
- risposta `304 Not Modified`.

La strategia viene adattata alla configurazione realmente disponibile senza introdurre un meccanismo custom se i normali strumenti HTTP risultano sufficienti.

### API Drupal

Durante l'implementazione devono essere verificati:

- struttura della response di `/api/areas`;
- esposizione di id, label, iconUrl e weight;
- ordinamento delle aree;
- costruzione dell'URL dell'icona nei diversi ambienti;
- recupero degli articoli separato per area;
- esposizione di tutti i campi necessari;
- normalizzazione dei diversi content type nel modello `Article`;
- ordinamento degli articoli tramite `field_weight`;
- formato del body HTML;
- struttura dei link di approfondimento;
- comportamento quando una singola area non è disponibile.

Devono inoltre essere misurate la dimensione complessiva dei dati e la
dimensione delle singole response per area.

### Rendering HTML

Devono essere verificati con contenuti migrati e nuovi:

- rendering del body `Full HTML`;
- tabelle;
- immagini;
- liste;
- codice inline;
- code block;
- link;
- classi CSS esistenti;
- embed.

### Embed esterni

Per ogni provider realmente utilizzato devono essere verificati:

- modalità di caricamento;
- comportamento responsive;
- possibilità di lazy loading;
- fallback in caso di errore;
- eventuali cookie o meccanismi di tracciamento;
- requisiti della Content Security Policy;
- permessi necessari agli iframe.

In particolare deve essere verificata l'integrazione corrente di CodePen senza indicizzarne il contenuto remoto.

### Servizi esterni della home

Per Stack Overflow, GitHub e le sorgenti RSS devono essere verificati:

- disponibilità e modalità di accesso delle sorgenti esterne;
- eventuali rate limit, quote o meccanismi di throttling;
- eventuali requisiti di autenticazione;
- comportamento in caso di indisponibilità del servizio;
- frequenza appropriata di aggiornamento dei dati memorizzati in cache.

Le integrazioni rimangono opzionali e un loro errore non deve compromettere la consultazione degli articoli.

### Web clipper

Durante l'implementazione deve essere scelta e verificata la modalità concreta di autenticazione dell'estensione verso Drupal.

La soluzione deve garantire:

- assenza della password amministrativa nell'estensione;
- credenziale revocabile;
- privilegi limitati alla creazione delle risorse previste;
- comunicazione tramite HTTPS;
- corretta configurazione CORS.

Deve inoltre essere definito il comportamento in presenza di una risorsa con URL già esistente, verificando se sia preferibile impedire il duplicato, segnalarlo oppure consentirlo esplicitamente.

### Server-side rendering

Il server-side rendering configurato in Angular 22 deve essere verificato sull'applicazione reale.

Devono essere controllati in particolare:

- rendering della home;
- rendering diretto di un articolo tramite URL;
- recupero dei dati Drupal lato server;
- hydration nel browser;
- assenza di accessi a API esclusivamente browser, come IndexedDB, durante il rendering server-side;
- corretto passaggio dalla pagina renderizzata sul server alle funzionalità client-side.

### SEO

Dopo la pubblicazione devono essere verificati:

- `<title>`;
- meta description;
- canonical;
- Open Graph;
- JSON-LD Schema.org;
- sitemap XML;
- `robots.txt`;
- rendering SSR visibile ai crawler;
- meccanismo di generazione e mantenimento degli URL/slug pubblici degli articoli.

I dati strutturati devono essere controllati con gli strumenti di validazione disponibili.

Gli URL presenti nella sitemap e nei canonical devono corrispondere agli URL pubblici Angular e non ai percorsi interni Drupal.

Il sito deve inoltre essere registrato in Google Search Console per verificare indicizzazione, crawling e corretta acquisizione della sitemap.

### Performance

Le performance devono essere misurate sull'applicazione reale e non dedotte soltanto dalle scelte architetturali.

Devono essere osservati in particolare:

- Largest Contentful Paint;
- Interaction to Next Paint;
- Cumulative Layout Shift;
- First Contentful Paint;
- Time to First Byte.

Le misurazioni possono essere effettuate tramite strumenti come:

- Chrome DevTools;
- Lighthouse;
- PageSpeed Insights.

I risultati devono essere utilizzati per individuare eventuali colli di bottiglia relativi, ad esempio, a:

- SSR;
- API Drupal;
- dataset degli articoli;
- costruzione dell'indice;
- immagini;
- font;
- embed;
- JavaScript iniziale.

Non vengono fissate preventivamente soglie specifiche all'interno dell'analisi tecnica: le metriche vengono utilizzate come strumenti di misurazione e diagnosi durante l'implementazione e dopo il deploy.

### Accessibilità

Devono essere effettuate verifiche manuali oltre agli eventuali controlli automatici.

Devono essere controllati almeno:

- navigazione completa tramite tastiera;
- focus visibile;
- gestione del focus di drawer e overlay;
- ritorno del focus alla chiusura dei componenti;
- navigazione verso una `SearchOccurrence`;
- comportamento con `prefers-reduced-motion`;
- leggibilità di code block e tabelle su viewport ridotte;
- nomi accessibili dei controlli rappresentati tramite icone;
- comportamento dell'interfaccia senza feedback sonori.

### Responsive e browser

L'interfaccia deve essere verificata con dimensioni differenti, senza limitarsi ai wireframe desktop e mobile.

Devono essere controllati in particolare:

- passaggio progressivo tra layout desktop e mobile;
- sidebar e drawer;
- search bar;
- risultati di ricerca;
- code block;
- tabelle;
- embed;
- sezioni scrollabili della home.

La verifica deve includere almeno i browser moderni effettivamente supportati dal progetto.
