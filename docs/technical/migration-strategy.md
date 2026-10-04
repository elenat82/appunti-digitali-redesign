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
- le trasformazioni necessarie vengono implementate nella pipeline di migrazione e non applicate manualmente ai singoli contenuti;
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
- markup necessario alla corretta visualizzazione dei contenuti tecnici.

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

La migrazione deve quindi determinare, quando possibile, il valore di ordinamento corrispondente per ogni articolo importato.

## Dati legacy non mantenuti

Non tutti i dati presenti nel sito Drupal 8 devono essere trasferiti.

In particolare, il nuovo modello non prevede la migrazione dei campi:

- Tag;
- Correlati.

Questi dati non devono quindi essere trasferiti soltanto per riprodurre fedelmente la struttura del vecchio sito.

La migrazione deve privilegiare il modello dati definito per il nuovo sito, non la duplicazione completa della struttura legacy.

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
- eventuali differenze tra i content type.

Il mapping definitivo deve essere basato sui dati effettivamente presenti nel sito legacy e non su assunzioni relative ai nomi dei campi.

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
- eventuali immagini o embed.

La limitazione ai contenuti selezionati riguarda soltanto l'esecuzione.
Mapping, trasformazioni e configurazione della migration devono essere gli stessi che verranno utilizzati per l'import completo.

Questo permette di utilizzare immediatamente contenuti reali nel frontend e, contemporaneamente, di verificare la pipeline destinata alla migrazione definitiva.

## Trasformazioni del body

Il body deve essere migrato mantenendo il markup semantico necessario alla consultazione e alla ricerca.

Le trasformazioni non devono essere eseguite manualmente sui singoli nodi: quando una trasformazione è necessaria deve essere implementata nella pipeline di migrazione, in modo che venga applicata in maniera uniforme e ripetibile.

È già stata individuata la necessità di verificare la gerarchia degli heading del sito legacy rispetto alla nuova pagina articolo.

Nel frontend Angular il titolo dell'articolo è un `h1`; il body non deve quindi introdurre un secondo `h1`.

La trasformazione definitiva degli heading verrà stabilita dopo aver analizzato un campione dei body Drupal 8 e verificato che la struttura sia coerente tra i diversi articoli.

## Verifica della migrazione

La migrazione parziale deve essere verificata sia nel backend Drupal sia nel frontend Angular.

Per ogni articolo campione devono essere controllati almeno:

- content type corretto;
- titolo;
- stato di pubblicazione;
- body HTML;
- gerarchia degli heading;
- liste;
- tabelle;
- codice inline;
- blocchi di codice;
- link interni al body;
- approfondimenti;
- ordinamento;
- rendering nel frontend;
- syntax highlighting;
- indicizzazione da parte della ricerca client-side;
- navigazione verso le singole occorrenze della ricerca.

Le eventuali anomalie devono essere risolte modificando la pipeline e rieseguendo la migrazione.

## Migrazione definitiva

Quando mapping e trasformazioni sono stati verificati sul campione, la stessa pipeline viene utilizzata per l'intero dataset.

Prima dell'import definitivo deve essere acquisita una copia aggiornata della sorgente Drupal 8, in modo da includere le modifiche ai contenuti avvenute durante lo sviluppo del nuovo sito.

La procedura definitiva dovrà prevedere:

1. acquisizione della sorgente Drupal 8 aggiornata;
2. preparazione del database Drupal 11;
3. esecuzione completa delle migration;
4. verifica dei risultati;
5. verifica delle API Drupal;
6. verifica dei contenuti nel frontend Angular;
7. verifica della ricerca;
8. verifica degli eventuali file migrati.

La procedura utilizzata per il rilascio dovrà essere documentata con i comandi effettivamente necessari una volta completata l'implementazione.

## Aspetti ancora da definire

I seguenti aspetti richiedono l'analisi del sito Drupal 8 prima di poter essere definiti in modo definitivo:

- mapping esatto dei machine name legacy;
- meccanismo tecnico utilizzato per leggere il database Drupal 8;
- migration necessarie e relative dipendenze;
- gestione dell'ordinamento legacy;
- trasformazioni definitive degli heading;
- gestione di immagini e file locali;
- gestione degli embed;
- gestione degli alias URL;
- eventuale preservazione delle date di creazione e modifica;
- eventuali altri dati del sito legacy da migrare oltre agli articoli.

Questi punti verranno aggiornati nel documento man mano che viene analizzata la sorgente e implementata la pipeline.