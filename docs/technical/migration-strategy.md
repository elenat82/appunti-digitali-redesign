# Strategia di migrazione

## Obiettivo

La migrazione ha l'obiettivo di trasferire nel nuovo backend Drupal 11 i contenuti da mantenere dell'attuale sito Drupal 8, adattandoli al nuovo modello dati senza perdere le informazioni utili alla consultazione degli articoli.

La migrazione deve essere ripetibile e verificabile.

La stessa pipeline utilizzata durante lo sviluppo deve poter essere riutilizzata per la migrazione definitiva. Le prove iniziali non devono quindi basarsi su import manuali o procedure temporanee che dovranno essere abbandonate in fase di rilascio.

## Principi

La migrazione viene progettata secondo i seguenti principi:

- Drupal 8 costituisce la sorgente dei dati legacy;
- Drupal 11 costituisce la destinazione;
- il database Drupal 8 non viene modificato dalla procedura di migrazione;
- le trasformazioni sistematiche necessarie vengono implementate nella pipeline di migrazione e non applicate manualmente ai singoli contenuti;
- eventuali correzioni manuali sono ammesse soltanto per eccezioni isolate, esplicitamente documentate e non convenienti da generalizzare nella pipeline;
- la migrazione deve poter essere eseguita più volte durante lo sviluppo;
- la migrazione parziale utilizzata durante lo sviluppo deve utilizzare le stesse definizioni della migrazione completa;
- la selezione di un sottoinsieme di contenuti deve avvenire in fase di esecuzione e non attraverso migration dedicate esclusivamente ai dati di prova;
- prima della migrazione definitiva deve essere possibile verificare il risultato e correggere la pipeline senza modificare manualmente i dati importati.

## Ambito iniziale

La prima parte della migrazione riguarda gli articoli tecnici.

Nel nuovo Drupal le aree tematiche continuano a essere rappresentate da content type distinti.

Le aree inizialmente previste sono:

- HTML;
- CSS;
- JavaScript;
- Angular;
- PHP;
- Drupal;
- Varie.

I diversi content type vengono esposti al frontend Angular attraverso un modello applicativo comune.

La migrazione deve preservare, dove possibile:

- titolo;
- area tematica;
- body HTML;
- link di approfondimento;
- ordine degli articoli;
- struttura dei blocchi di codice;
- markup necessario alla corretta visualizzazione dei contenuti tecnici;
- stato di pubblicazione;
- ordine delle aree tematiche.

L'eventuale migrazione di altri dati del sito legacy verrà analizzata separatamente.

## Modello di destinazione

Ogni content type tecnico del nuovo Drupal utilizza i seguenti dati principali.

### Titolo

Il titolo viene memorizzato nel campo base `title` del nodo.

### Body

Il contenuto principale viene memorizzato nel campo `field_body`.

Il campo contiene testo formattato e deve poter preservare il markup necessario agli articoli tecnici, tra cui:

- heading;
- paragrafi;
- liste;
- tabelle;
- blocchi di codice;
- codice inline;
- link;
- immagini;
- embed esterni.

Il text format previsto nel nuovo sito è `Full HTML`.

### Approfondimenti

I link esterni associati all'articolo vengono memorizzati nel campo multivalore `field_approfondimenti`.

I link contestuali inseriti direttamente nel body rimangono invece parte del body HTML.

### Ordinamento

L'ordinamento degli articoli all'interno dell'area viene gestito tramite `field_weight`.

La migrazione deve trasferire il valore legacy di `field_weight` nel corrispondente campo `field_weight` del nodo Drupal 11.

## Analisi della sorgente Drupal 8

Prima di implementare il mapping definitivo deve essere analizzata la struttura reale del database Drupal 8.

Per ogni area tematica devono essere verificati almeno:

- machine name del content type;
- campo contenente il body;
- campo o struttura contenente gli approfondimenti;
- eventuale campo utilizzato per l'ordinamento;
- stato di pubblicazione;
- formato di testo utilizzato dal body;
- presenza di immagini o file locali;
- struttura dei blocchi di codice;
- struttura degli embed CodePen legacy;
- eventuali differenze tra i content type.

Il mapping definitivo deve essere basato sui dati effettivamente presenti nel sito legacy e non su assunzioni relative ai nomi dei campi.

### Content type legacy

L'analisi del database Drupal 8 ha rilevato i seguenti content type tecnici:

| Content type | Pubblicati | Non pubblicati |
| --- | ---: | ---: |
| angular | 2 | 0 |
| css | 21 | 0 |
| drupal | 26 | 26 |
| html | 17 | 0 |
| javascript | 36 | 0 |
| php | 32 | 0 |
| varie | 26 | 1 |

Sono inoltre presenti i content type `feed_rss` e `strumenti_utili`, che non rientrano nella migrazione iniziale degli articoli tecnici.

I 52 contenuti dell'area Drupal devono essere mantenuti integralmente, preservandone lo stato di pubblicazione.

### Struttura dei campi legacy

I content type tecnici del Drupal 8 utilizzano una struttura in gran parte comune.

Tutti i content type tecnici contengono i seguenti campi:

- `body`;
- `field_approfondimenti`;
- `field_content_type_weight`;
- `field_correlati`;
- `field_tags`;
- `field_weight`.

Sono inoltre presenti alcuni campi specifici per area:

- Angular:
  - `field_angular_tags`;
  - `field_versioni_angular`;
- CSS:
  - `field_tags_css`;
  - `field_versioni_css`;
- Drupal:
  - `field_tags_drupal`;
- HTML:
  - `field_tags_html`;
  - `field_versioni_html`;
- JavaScript:
  - `field_tags_js`;
  - `field_versioni_js`;
- PHP:
  - `field_tags_php`.

Il mapping principale già identificato è:

| Drupal 8 | Drupal 11 |
| --- | --- |
| `title` | `title` |
| `status` | `status` |
| `body` | `field_body` |
| `field_approfondimenti` | `field_approfondimenti` |
| `field_weight` | `field_weight` |
| `field_content_type_weight` | weight della configurazione dell'area |

I campi relativi a tag e correlati non fanno parte del nuovo modello dati.

### Campi legacy non migrati

Alcuni campi presenti nei content type tecnici del Drupal 8 non vengono mantenuti nel nuovo modello dati.

Si tratta di campi introdotti in passato per funzionalità poi non utilizzate in modo significativo e che non sono più necessarie nel nuovo sito.

Non devono essere migrati i seguenti campi:

- `field_tags`;
- `field_correlati`;

e i campi specifici per area:

- Angular:
  - `field_angular_tags`;
  - `field_versioni_angular`;
- CSS:
  - `field_tags_css`;
  - `field_versioni_css`;
- Drupal:
  - `field_tags_drupal`;
- HTML:
  - `field_tags_html`;
  - `field_versioni_html`;
- JavaScript:
  - `field_tags_js`;
  - `field_versioni_js`;
- PHP:
  - `field_tags_php`.

L'eventuale presenza di valori in questi campi nel database legacy non costituisce un requisito di conservazione.

La migrazione deve trasferire soltanto i dati previsti dal nuovo modello, evitando di riprodurre campi o classificazioni non più utilizzati.

### Ordinamento legacy

Il sito Drupal 8 utilizza due campi distinti per l'ordinamento.

`field_content_type_weight` determina l'ordine di presentazione delle aree tematiche.

`field_weight` determina invece l'ordine dei singoli articoli all'interno della relativa area.

Nel database legacy `field_content_type_weight` è memorizzato sui singoli nodi, ma il valore è uniforme all'interno di ciascun content type:

| Area | `field_content_type_weight` Drupal 8 |
| --- | ---: |
| HTML | 10 |
| CSS | 20 |
| JavaScript | 30 |
| Angular | 40 |
| PHP | 50 |
| Drupal | 60 |
| Varie | 70 |

Nel nuovo Drupal l'ordine delle aree non viene memorizzato sui nodi.

Ogni content type configurato come area tematica utilizza invece il third-party setting `appunti_digitali.weight`.

I valori legacy vengono normalizzati preservandone l'ordine relativo:

| Area | Drupal 8 | Drupal 11 |
| --- | ---: | ---: |
| HTML | 10 | 0 |
| CSS | 20 | 1 |
| JavaScript | 30 | 2 |
| Angular | 40 | 3 |
| PHP | 50 | 4 |
| Drupal | 60 | 5 |
| Varie | 70 | 6 |

Non è necessario preservare i valori numerici originali, perché il loro significato applicativo consiste esclusivamente nell'ordine relativo delle aree.

La configurazione dei weight delle aree fa parte della configurazione versionata del Drupal 11 e viene quindi mantenuta tramite `config/sync`; non viene generata dalla migration dei nodi.

L'endpoint `/api/areas` utilizza questi weight per restituire le aree nel seguente ordine:

    html
    css
    javascript
    angular
    php
    drupal
    varie

L'ordine restituito dall'API è stato verificato rispetto alla sorgente legacy.

`field_weight`, invece, rimane un dato appartenente al singolo articolo e viene migrato direttamente nel corrispondente campo `field_weight` del nodo Drupal 11.

Il mapping è quindi:

| Drupal 8 | Drupal 11 |
| --- | --- |
| `field_content_type_weight` | ordine normalizzato nel third-party setting `appunti_digitali.weight` del content type |
| `field_weight` | `field_weight` del nodo |

### Stato di pubblicazione

La migrazione deve preservare lo stato di pubblicazione dei contenuti.

I nodi pubblicati nel Drupal 8 devono essere creati come pubblicati nel Drupal 11, mentre i nodi non pubblicati devono rimanere non pubblicati.

Questo vale anche per l'area Drupal, che contiene attualmente:

- 26 articoli pubblicati;
- 26 articoli non pubblicati.

Entrambi i gruppi devono essere mantenuti.

La presenza di contenuti non pubblicati nel backend non modifica il contratto del frontend pubblico: le API Drupal continuano a esporre ad Angular esclusivamente i contenuti pubblicati.

### Formato del body legacy

Tutti i 187 articoli tecnici del Drupal 8 utilizzano il text format `full_html`.

Nessun articolo tecnico utilizza il summary del campo body.

La migrazione deve quindi:

- trasferire `body_value` nel nuovo `field_body.value`;
- impostare `field_body.format` a `full_html`;
- non migrare `body_summary`, perché non contiene dati da preservare.

Il mapping è:

| Drupal 8 | Drupal 11 |
| --- | --- |
| `body_value` | `field_body.value` |
| `body_format` (`full_html`) | `field_body.format` (`full_html`) |

Il markup HTML del body deve essere preservato, salvo le trasformazioni esplicitamente previste dalla pipeline di migrazione.

### Immagini legacy

L'analisi dei body legacy ha individuato 116 riferimenti a immagini negli articoli tecnici.

Le immagini si dividono in tre categorie.

#### Immagini Drupal gestite

23 immagini appartengono ad articoli pubblicati e sono registrate nel Drupal 8 come file entity utilizzate dall'editor.

I file sono memorizzati nel filesystem privato legacy sotto:

    private://inline-images/

I relativi file fisici sono disponibili nella directory `private-files`.

Queste immagini devono essere migrate nel Drupal 11 come file gestiti.

Nel nuovo sito tutte le immagini originali utilizzate nei body degli articoli vengono memorizzate nella stessa directory pubblica:

    public://article-images/

corrispondente sul filesystem Drupal a:

    sites/default/files/article-images/

Non vengono create sottodirectory per articolo, area tematica o data.

La stessa directory viene utilizzata anche per le nuove immagini caricate in futuro dal body degli articoli tramite Drupal.

La migrazione deve aggiornare i riferimenti presenti nel body in modo che puntino correttamente ai file del nuovo Drupal.

#### Immagini legacy escluse dalla migrazione

90 immagini sono utilizzate esclusivamente da quattro articoli Drupal non pubblicati destinati a essere riscritti:

- `nid 490`: 1 immagine appartenente al vecchio tema Corkedscrewer;
- `nid 495`: 46 immagini sotto `sites/default/files/variabiliglobali/`;
- `nid 506`: 21 immagini sotto `sites/default/files/install-localhost/`;
- `nid 510`: 22 immagini sotto `sites/default/files/drush/`.

I nodi vengono mantenuti come contenuti non pubblicati, ma queste immagini non vengono migrate nel Drupal 11.

I relativi file vengono conservati esclusivamente come backup del sito legacy.

Non viene introdotta nella pipeline una gestione specifica per questi asset, perché gli articoli verranno riscritti prima di un'eventuale ripubblicazione.

#### Immagini esterne

Tre immagini utilizzate negli articoli pubblicati provengono da servizi esterni e sono referenziate tramite URL assoluto.

Questi riferimenti non vengono trasformati dalla migrazione e rimangono esterni.

### Approfondimenti legacy

Il campo `field_approfondimenti` è un campo Link multivalore.

Nel database Drupal 8 sono presenti 126 approfondimenti associati a 58 articoli tecnici.

Tutti gli approfondimenti sono link esterni.

Ogni valore deve preservare:

- URI;
- titolo del link;
- posizione relativa rispetto agli altri valori dello stesso articolo.

Il titolo del link non è valorizzato in modo uniforme nel sito legacy.
Sono presenti:

- link senza titolo;
- link il cui titolo coincide con l'URL;
- link con un titolo descrittivo.

La migrazione deve preservare il valore legacy senza generare o normalizzare automaticamente il titolo.

Il campo `field_approfondimenti_options` contiene sempre un array vuoto serializzato (`a:0:{}`) e non deve quindi essere migrato.

Il mapping è:

| Drupal 8 | Drupal 11 |
| --- | --- |
| `field_approfondimenti_uri` | `field_approfondimenti.uri` |
| `field_approfondimenti_title` | `field_approfondimenti.title` |
| `delta` | ordine dei valori multivalore |

### CodePen legacy

Il sito Drupal 8 utilizza CodePen Prefill Embed per alcuni esempi frontend interattivi.

Nel body legacy gli embed sono identificati tramite il wrapper `.penny`. Il censimento ha individuato questo marker in 26 articoli tecnici, con più embed presenti in alcuni articoli.

La struttura rilevata è riconducibile al seguente formato:

    <div class="penny">
      <pre data-lang="html">...</pre>
      <pre data-lang="css" data-option-autoprefixer="true">...</pre>
      <pre data-lang="js">...</pre>
    </div>

I blocchi `pre` effettivamente presenti variano in base alla demo. Alcuni embed contengono HTML, CSS e JavaScript; altri omettono uno dei blocchi oppure mantengono placeholder legacy come `// no js` o commenti equivalenti.

La migrazione non deve aggiungere, rimuovere o normalizzare questi blocchi in base al loro contenuto: il codice, l'ordine dei `pre`, l'escaping dell'HTML e gli eventuali placeholder vengono preservati.

L'analisi degli attributi `data-*` presenti realmente nel markup dell'embed, escludendo gli attributi che compaiono soltanto come codice HTML escaped all'interno dei `pre`, ha rilevato esclusivamente:

- `data-lang`;
- `data-option-autoprefixer`.

Il primo identifica il linguaggio del blocco. Il secondo è la forma legacy utilizzata per abilitare Autoprefixer e deve essere normalizzato nel formato attuale previsto da CodePen:

    data-option-autoprefixer="true"
        ↓
    data-options-autoprefixer="true"

Nel sito legacy il frontend Angular completa inoltre gli embed a runtime aggiungendo classe e configurazione CodePen, tra cui altezza, tema, modalità editable, tab iniziale e `data-prefill`.

Queste impostazioni comuni di presentazione non devono essere materializzate nei body migrati. Nel nuovo sito sono responsabilità del frontend Angular, secondo quanto definito nell'analisi tecnica.

Il formato di destinazione del wrapper è quindi:

    <div class="codepen-demo" data-prefill>
      ...
    </div>

La trasformazione sistematica applicata dalla pipeline è:

    <div class="penny">
        ↓
    <div class="codepen-demo" data-prefill>

La pipeline deve quindi:

- sostituire il marker `.penny` con `.codepen-demo`;
- aggiungere l'attributo `data-prefill` al wrapper;
- preservare integralmente i `pre` e il relativo contenuto;
- preservare `data-lang`;
- rinominare `data-option-autoprefixer` in `data-options-autoprefixer`;
- non aggiungere `class="codepen"`, perché l'inizializzazione dell'embed viene controllata dal frontend;
- non migrare nel body `data-height`, `data-theme-id`, `data-editable` o `data-default-tab`, perché sono impostazioni comuni gestite da Angular;
- non introdurre regole basate sul titolo o sull'identità del singolo articolo.

#### Eccezione Geolocation API

Nel vecchio frontend l'articolo `Geolocation API` viene riconosciuto tramite il titolo e riceve a runtime una configurazione `data-prefill` speciale che aggiunge la Google Maps JavaScript API come risorsa esterna.

Questa eccezione non viene riprodotta nella nuova pipeline né nel nuovo frontend.

Il body dell'articolo contiene già un'istruzione che invita a procurarsi una Google Maps API key, aprire l'esempio su CodePen e configurare la risorsa esterna. Poiché si tratta di un unico contenuto, dopo la migrazione definitiva l'articolo viene verificato e, se necessario, corretto manualmente per rendere esplicita la modalità corrente di aggiunta della risorsa JavaScript esterna.

La correzione manuale del contenuto viene registrata nella checklist post-migrazione e non costituisce una regola generale della migration.

## Strategia di esecuzione

Durante lo sviluppo viene utilizzata una copia locale del database Drupal 8.

La copia legacy rimane separata dal database Drupal 11 e viene utilizzata esclusivamente come sorgente della migrazione.

La procedura segue concettualmente questo flusso:

    Drupal 8
        ↓
    database legacy locale
        ↓
    pipeline di migrazione
        ↓
    Drupal 11
        ↓
    API Drupal
        ↓
    frontend Angular

La pipeline contiene il mapping tra dati legacy e modello Drupal 11 e le eventuali trasformazioni necessarie.

## Migrazione parziale durante lo sviluppo

Per poter utilizzare contenuti reali durante lo sviluppo grafico non viene creata una migrazione temporanea separata.

La migration definitiva viene inizialmente eseguita soltanto su un sottoinsieme rappresentativo degli articoli.

Il campione deve comprendere contenuti utili a verificare almeno:

- articoli lunghi;
- articoli brevi;
- heading su più livelli;
- liste;
- tabelle;
- codice inline;
- blocchi di codice;
- link nel body;
- approfondimenti esterni;
- eventuali immagini;
- CodePen senza opzioni aggiuntive;
- CodePen con `data-option-autoprefixer`;
- CodePen con uno dei blocchi `pre` assente o mantenuto come placeholder legacy.

La limitazione ai contenuti selezionati riguarda soltanto l'esecuzione.
Mapping, trasformazioni e configurazione della migration devono essere gli stessi che verranno utilizzati per l'import completo.

Questo permette di utilizzare immediatamente contenuti reali nel frontend e, contemporaneamente, di verificare la pipeline destinata alla migrazione definitiva.

## Trasformazioni del body

Il body deve essere migrato mantenendo il markup semantico necessario alla consultazione e alla ricerca.

Quando una trasformazione riguarda un pattern ricorrente deve essere implementata nella pipeline di migrazione, in modo che venga applicata in maniera uniforme e ripetibile. Correzioni manuali sono riservate a eccezioni isolate già identificate e documentate, come il controllo post-migrazione dell'articolo `Geolocation API`.

Per gli embed CodePen la trasformazione sistematica è già definita nella sezione dedicata all'analisi del formato legacy e deve essere applicata a tutti i wrapper `.penny`.

È già stata individuata la necessità di verificare la gerarchia degli heading del sito legacy rispetto alla nuova pagina articolo.

Nel frontend Angular il titolo dell'articolo è un `h1`; il body non deve quindi introdurre un secondo `h1`.

### Normalizzazione degli heading

Nel sito legacy il titolo dell'articolo non è contenuto nel body.

L'analisi dei 187 articoli tecnici ha rilevato che la gerarchia interna utilizza esclusivamente:

- `h3` come primo livello di sezione;
- `h4` come secondo livello di sezione.

Tre articoli legacy contenevano erroneamente `h4` senza un precedente `h3`; questi casi sono stati corretti direttamente nel Drupal 8 prima della migrazione.

Nel nuovo frontend il titolo dell'articolo viene renderizzato come `h1`.

La migration normalizza quindi gli heading del body secondo il mapping:

| Drupal 8 | Drupal 11 / frontend |
| --- | --- |
| `h3` | `h2` |
| `h4` | `h3` |

Il contenuto e gli eventuali attributi degli heading vengono preservati.

La trasformazione viene applicata dal process plugin `appunti_digitali_transform_legacy_body`.

## Verifica della migrazione

La migrazione parziale deve essere verificata sia nel backend Drupal sia nel frontend Angular.

Per ogni articolo campione devono essere controllati almeno:

- content type corretto;
- titolo;
- stato di pubblicazione;
- body HTML;
- immagini locali migrate;
- riferimenti alle immagini nel body;
- rendering delle immagini nel frontend;
- gerarchia degli heading;
- liste;
- tabelle;
- codice inline;
- blocchi di codice;
- trasformazione dei wrapper `.penny` in `.codepen-demo` con `data-prefill`;
- preservazione dei `pre` e dei relativi `data-lang` negli embed CodePen;
- normalizzazione di `data-option-autoprefixer` in `data-options-autoprefixer`;
- assenza nel body delle configurazioni di presentazione CodePen che devono rimanere responsabilità del frontend;
- esclusione del contenuto interno di `.codepen-demo` dall’indice di ricerca client-side;
- link interni al body;
- approfondimenti;
- ordinamento;
- rendering nel frontend;
- syntax highlighting;
- indicizzazione da parte della ricerca client-side;
- navigazione verso le singole occorrenze della ricerca.

Le anomalie che riguardano pattern sistematici devono essere risolte modificando la pipeline e rieseguendo la migrazione. Le sole eccezioni manuali previste devono essere documentate e ricontrollate dopo ogni esecuzione completa.

### Full dry run degli articoli tecnici

La pipeline completa è stata eseguita su una copia aggiornata del database Drupal 8 dopo aver effettuato il rollback delle migration di sviluppo.

L'esecuzione completa ha prodotto:

- 23 file entity migrate su 23;
- 187 articoli tecnici migrati su 187;
- 0 elementi falliti;
- 0 elementi ignorati;
- 0 elementi non processati;
- 0 messaggi di errore.

La riconciliazione quantitativa tra Drupal 8 e Drupal 11 ha verificato:

- identica distribuzione degli articoli per content type;
- identico stato di pubblicazione per tutti i 187 articoli;
- 0 differenze nei titoli;
- 0 differenze nei `field_weight`;
- 126 approfondimenti migrati su 126, associati agli stessi 58 articoli;
- 0 differenze negli URI degli approfondimenti;
- 0 differenze nei titoli degli approfondimenti;
- 0 differenze nell'ordine dei valori multivalore.

La verifica delle trasformazioni del body ha confermato:

- 187 body su 187 con formato `full_html`;
- 1153 heading legacy `h3` trasformati in `h2`;
- 306 heading legacy `h4` trasformati in `h3`;
- nessun `h1` o `h4` residuo nei body migrati;
- 23 riferimenti alle immagini Drupal gestite aggiornati al nuovo percorso;
- nessun riferimento residuo a `/web/system/files/inline-images/`;
- 23 file entity migrate con relativo `file_usage`;
- 43 wrapper CodePen legacy `.penny` trasformati in 43 `.codepen-demo`;
- nessun wrapper `.penny` residuo;
- normalizzazione di `data-option-autoprefixer` in `data-options-autoprefixer`.

Il full dry run conferma quindi che la pipeline degli articoli tecnici è ripetibile e produce il dataset atteso.

## Migrazione definitiva

La pipeline degli articoli tecnici è stata verificata tramite un full dry run sull'intero dataset legacy.

Il dry run ha confermato il corretto funzionamento delle migration e delle relative dipendenze, con il seguente ordine di esecuzione:

1. migration delle file entity utilizzate nei body degli articoli;
2. migration degli articoli tecnici.

La migration degli articoli dipende quindi dalla migration delle immagini e deve essere eseguita successivamente, in modo che i riferimenti alle file entity e il relativo `file_usage` possano essere creati correttamente durante l'import dei nodi.

Per il rilascio definitivo verrà utilizzata la stessa pipeline già verificata, applicata a una copia aggiornata della sorgente Drupal 8.

Prima dell'import definitivo deve quindi essere acquisita una nuova copia del database Drupal 8 e dei file legacy necessari, in modo da includere eventuali modifiche ai contenuti avvenute durante lo sviluppo del nuovo sito.

La procedura definitiva dovrà prevedere:

1. acquisizione della sorgente Drupal 8 aggiornata;
2. acquisizione dei file legacy necessari alla migrazione;
3. preparazione del database e della configurazione Drupal 11;
4. esecuzione delle migration nell'ordine definito dalle relative dipendenze;
5. esecuzione delle eventuali correzioni manuali eccezionali documentate nella checklist post-migrazione;
6. verifica quantitativa dei dati migrati;
7. verifica qualitativa di un campione rappresentativo;
8. verifica delle API Drupal;
9. verifica dei contenuti nel frontend Angular;
10. verifica della ricerca;
11. verifica dei file migrati e dei relativi riferimenti.

Per gli articoli tecnici, il full dry run ha già verificato con successo:

- 23 file entity migrate su 23;
- 187 articoli tecnici migrati su 187;
- preservazione di content type, titolo, stato di pubblicazione e ordinamento;
- preservazione dei 126 link di approfondimento;
- trasformazione degli heading;
- trasformazione del markup CodePen;
- migrazione e aggiornamento dei riferimenti alle immagini;
- creazione del `file_usage`;
- assenza di elementi falliti, ignorati o non processati.

La procedura completa di rilascio verrà aggiornata con i comandi effettivamente necessari quando saranno state implementate e verificate anche le migration degli altri dati del sito.

## Aspetti ancora da definire

I seguenti aspetti richiedono ulteriori analisi o verranno definiti durante l'implementazione della pipeline:

- meccanismo tecnico utilizzato per leggere il database Drupal 8;
- migration necessarie e relative dipendenze;
- gestione di eventuali embed diversi da CodePen;
- gestione degli alias URL;
- eventuale preservazione delle date di creazione e modifica;
- eventuali altri dati del sito legacy da migrare oltre agli articoli.

Questi punti verranno aggiornati nel documento man mano che viene analizzata la sorgente e implementata la pipeline.