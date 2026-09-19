# Design system

Il design system definisce l'identità visiva e le regole di presentazione della nuova versione di **Appunti Digitali**.

Le scelte tecniche necessarie per implementare questi elementi saranno definite nell'analisi tecnica. Il design system descrive quindi il risultato visivo e il comportamento desiderato, senza vincolarlo preventivamente a specifiche librerie.

## Principi visivi

L'interfaccia deve mantenere l'aspetto di una knowledge base personale, tecnica e densa, evitando però un'eccessiva decorazione.

Il nome **Appunti Digitali** deve riflettersi nell'identità visiva del sito attraverso richiami discreti a:

- scrittura a mano;
- quaderni e carta;
- evidenziatori;
- penne e matite;
- materiale scolastico e cancelleria.

Questi elementi devono caratterizzare l'interfaccia senza compromettere leggibilità, accessibilità e rapidità di consultazione.

L'aspetto generale deve risultare personale e riconoscibile, ma il contenuto tecnico deve rimanere l'elemento principale.

## Tavole visuali

Le tavole visuali accompagnano il design system mostrando esempi
dell'applicazione di palette, tipografia, contenuti e componenti.

I testi e i dati utilizzati nelle tavole possono essere contenuti
dimostrativi e non rappresentano necessariamente funzionalità o dati
reali di Appunti Digitali.

Il presente documento costituisce la fonte di riferimento per le
decisioni del design system.

### Foundations

![Design system - Foundations](design-system/foundations.jpg)

### Content

![Design system - Content](design-system/content.jpg)

### Components

![Design system - Components](design-system/components.jpg)

## Logo

Il logo attuale rappresenta un tasto `A` di una tastiera.

Il concetto può essere ripensato nella nuova versione, mantenendo un collegamento riconoscibile tra scrittura e tecnologia.

La definizione del nuovo logo rimane una decisione aperta.

Il logo non deve essere necessario per identificare il sito quando la sidebar è collassata, perché il nome **Appunti Digitali** rimane visibile nell'header.

## Colori

La palette mantiene i colori principali già utilizzati nella versione attuale del sito.

L'obiettivo non è aumentare il numero di colori, ma assegnare a ciascuno un ruolo coerente e riconoscibile.

--color-primary       #284283
--color-secondary     #008b8b
--color-accent        #ffbdde

--color-text          rgba(51, 51, 51, .87)
--color-surface       #f5f6f7

### Verifica del contrasto della palette

Le principali combinazioni attualmente previste hanno i seguenti rapporti di contrasto:

| Combinazione | Contrasto | Indicazione |
|---|---:|---|
| `#284283` su `#ffffff` | 9.56:1 | AAA |
| `#284283` su `#f5f6f7` | 8.83:1 | AAA |
| `rgba(51, 51, 51, .87)` su `#ffffff` | 8.32:1 | AAA |
| `rgba(51, 51, 51, .87)` su `#f5f6f7` | 7.94:1 | AAA |
| `#008b8b` su `#ffffff` | 4.15:1 | non sufficiente per testo normale AA |
| `#008b8b` su `#f5f6f7` | 3.83:1 | adatto solo con dimensioni/pesi appropriati o per elementi non testuali |
| `#ffbdde` su `#ffffff` | 1.55:1 | non adatto come colore del testo |


### Blu principale

`#284283`

È il colore principale dell'identità visiva di Appunti Digitali e richiama il colore dell'inchiostro di una penna Bic.

Viene utilizzato principalmente per:

- sfondo dell'header;
- elementi principali dell'identità visiva;
- titoli `h1`, `h2` e `h3`;
- eventuali componenti che richiedono maggiore enfasi.

Non vengono definite preventivamente varianti più chiare o più scure. Eventuali variazioni saranno introdotte solo se necessarie per uno specifico componente o stato.

### Verde secondario

`#008b8b`

Il verde rappresenta il principale colore di accento.

Viene utilizzato principalmente per:

- controllo di apertura e chiusura della sidebar;
- eventuali scrollbar personalizzate;
- elementi grafici di accento associati agli `h4`;
- altri elementi secondari che devono essere riconoscibili senza competere con il blu principale.

A causa del rapporto di contrasto, il verde non viene utilizzato come colore predefinito per testo di piccole dimensioni su superfici chiare.

### Rosa decorativo

`#ffbdde`

Il rosa è un colore di accento secondario e deve essere utilizzato con maggiore moderazione rispetto a blu e verde.

Può essere utilizzato per:

- piccoli dettagli grafici;
- elementi particolari dell'interfaccia;
- sfondo della selezione del testo;
- eventuali elementi editoriali che richiedono una differenziazione visiva.

Il rosa non deve essere utilizzato come colore principale per testi su sfondi chiari, perché il contrasto sarebbe insufficiente.

L'utilizzo attuale per la classe `.parolachiave` deve essere rivalutato insieme alla definizione dello stile del codice inline e degli altri frammenti tecnici.

### Testo

Il testo principale utilizza `Lato`.

Il colore del testo principale è:

`rgba(51, 51, 51, .87)`

La scelta evita l'uso del nero pieno e mantiene una resa più morbida rispetto a `#000000`, senza compromettere la leggibilità.

Sulla superficie principale `#f5f6f7`, il colore risultante ha un contrasto di circa **7.94:1**.

Su sfondo bianco il contrasto è di circa **8.32:1**.

Entrambe le combinazioni superano i requisiti WCAG per il livello **AAA** anche per testo di dimensione normale.

Il corpo del testo deve privilegiare:

- leggibilità;
- spaziatura adeguata tra le righe;
- larghezza di riga confortevole;
- chiara differenziazione tra paragrafi e titoli.

### Superficie del contenuto

I paragrafi utilizzano attualmente come sfondo:

`#f5f6f7`

Questa tonalità molto chiara permette di distinguere il contenuto dallo sfondo decorativo della pagina senza introdurre un contrasto visivo eccessivo.

Può essere utilizzata come colore base delle superfici di lettura, eventualmente insieme ad altre tonalità neutre per card, tabelle e componenti.

### Colori aggiuntivi

Non vengono definite preventivamente scale di colori neutri o funzionali.

Nuovi colori vengono introdotti solo quando un componente reale ne richiede l'utilizzo e dopo averne verificato contrasto e coerenza con la palette esistente.

## Tipografia

La tipografia deve distinguere chiaramente gli elementi editoriali dagli elementi che richiamano la scrittura manuale.

Il carattere manoscritto viene utilizzato principalmente come elemento di identità visiva e non per i contenuti tecnici lunghi.

Il nome del sito presente nell'header non determina la gerarchia semantica della pagina: nelle pagine articolo il titolo dell'articolo rappresenta il titolo principale del contenuto.

### Gerarchia dei titoli

La gerarchia tipografica deve rendere immediatamente riconoscibili i diversi livelli del contenuto.

La scala iniziale è:

| Livello | Dimensione | Peso | Colore |
|---|---:|---:|---|
| `h1` | 30px | 700 | `#284283` |
| `h2` | 24px | 700 | `#284283` |
| `h3` | 20px | 700 | `#284283` |
| `h4` | 18px | 700 | colore del testo principale |

Gli `h4` possono utilizzare il verde `#008b8b` come elemento grafico di accento, senza necessariamente utilizzare il verde come colore del testo.

Le dimensioni definitive potranno essere leggermente adattate durante la verifica visuale, mantenendo però una differenza percepibile tra i diversi livelli.

### Testo

Il testo principale utilizza `Lato` con dimensione base di `16px`.

Il corpo del testo deve privilegiare:

- leggibilità;
- spaziatura adeguata tra le righe;
- larghezza di riga confortevole;
- chiara differenziazione tra paragrafi e titoli.

### Testo tecnico

Blocchi di codice, codice inline, nomi di file, comandi e altri frammenti tecnici devono utilizzare un font monospace.

Il font monospace definitivo rimane da scegliere.

## Sfondo e texture

Lo sfondo del sito mantiene il richiamo al quaderno a quadretti già presente nella versione attuale.

Può essere mantenuto anche il livello grafico che simula scarabocchi o segni a matita.

Queste texture devono rimanere decorative e sufficientemente leggere da non ridurre il contrasto o la leggibilità dei contenuti.

Nelle aree con elevata densità informativa può essere preferibile usare superfici più pulite sopra lo sfondo decorativo.

## Spaziature

Deve essere definita una scala coerente di spaziature da utilizzare per:

- distanza tra sezioni;
- padding dei componenti;
- distanza tra titolo e contenuto;
- distanza tra risultati di ricerca;
- margini dei blocchi di codice;
- separazione tra elementi della sidebar.

La scala definitiva verrà definita durante la realizzazione delle tavole visuali.

## Bordi, radius e ombre

Bordi, angoli arrotondati e ombre devono essere utilizzati con moderazione.

Il design deve evitare l'aspetto di una dashboard composta esclusivamente da card.

Gli elementi che richiamano fogli, appunti o materiale cartaceo possono utilizzare bordi e ombre leggere per suggerire sovrapposizione o materialità.

## Evidenziazione

Il tag `<mark>` e le occorrenze provenienti dalla ricerca devono avere un aspetto ispirato a un evidenziatore.

L'effetto deve risultare chiaramente visibile ma non compromettere la leggibilità del testo o del codice.

L'evidenziazione deve funzionare anche all'interno dei blocchi di codice.

## Elementi informativi

### Tip

La classe `.tip` attualmente utilizza uno sfondo che richiama una pagina di quaderno.

Il concetto deve essere mantenuto nella nuova versione.

La resa definitiva deve permettere di distinguere chiaramente un suggerimento dal normale contenuto senza renderlo eccessivamente invasivo.

### Parole chiave

Lo stile attualmente associato alla classe `.parolachiave` deve essere rivalutato.

Prima di mantenerlo è necessario verificare se svolge una funzione distinta rispetto a:

- codice inline;
- evidenziazione della ricerca;
- link;
- testo in evidenza.

Se non svolge una funzione semantica specifica, può essere eliminato per ridurre il numero di stili differenti.

## Codice

### Blocchi di codice

I blocchi di codice devono:

- essere chiaramente distinguibili dal testo normale;
- utilizzare un font monospace;
- supportare syntax highlighting;
- mostrare il linguaggio o formato quando noto;
- includere un controllo per la copia;
- permettere la selezione manuale del testo;
- supportare righe lunghe senza perdere contenuto.

La resa grafica deve essere coerente con il resto del sito anche se il syntax highlighting viene fornito da una libreria esterna.

I linguaggi e formati da rappresentare includono almeno:

`HTML`, `CSS`, `JavaScript`, `TypeScript`, `PHP`, `Twig`, `YAML`, `JSON`, `SQL` e `Bash`.

### Label del linguaggio

Quando noto, il linguaggio del blocco deve essere indicato tramite una label discreta, ad esempio:

`PHP` · `Twig` · `YAML` · `Bash`

La label indica il linguaggio del singolo snippet e non l'area tematica dell'articolo.

### Pulsante Copia

Il controllo di copia deve essere facilmente individuabile senza dominare visivamente il blocco.

Deve prevedere almeno:

- stato normale;
- hover;
- focus;
- feedback dopo la copia.

### Codice inline

Il codice inline deve essere distinguibile dal testo normale senza interrompere il flusso di lettura.

Deve utilizzare un font monospace e una resa più leggera rispetto ai blocchi di codice.

Lo stesso stile può essere utilizzato per elementi come:

- `core_version_requirement`;
- `.info.yml`;
- nomi di funzioni;
- nomi di metodi;
- selettori;
- brevi comandi;
- frammenti di sintassi.

Non è necessario mostrare il linguaggio del frammento inline.

## Componenti

### Avatar

La sezione di presentazione professionale della home page utilizza un avatar come rappresentazione visiva dell'amministratore.

L'avatar viene utilizzato al posto di una fotografia personale e mantiene coerenza con l'identità utilizzata negli altri profili professionali.

La sua presenza deve accompagnare la presentazione senza assumere maggiore importanza rispetto a nome, descrizione e contatti.

La resa deve:

- adattarsi correttamente al layout desktop e mobile;
- mantenere le proporzioni originali;
- integrarsi con lo stile grafico della sezione di presentazione;
- non essere utilizzata come unico elemento attraverso cui identificare l'amministratore.

### Loading

L'interfaccia non utilizza normalmente un loader a tutta pagina che impedisce la consultazione fino al completamento di tutte le richieste.

La struttura principale della pagina deve essere mostrata il prima possibile e le diverse sezioni devono popolarsi progressivamente quando i relativi dati diventano disponibili.

Ogni area che dipende da dati asincroni deve poter mostrare autonomamente uno stato di caricamento.

Questo principio riguarda in particolare:

- costruzione dell'indice per la ricerca;
- navigazione per aree tematiche;
- profilo pubblico;
- caricamento degli articoli;
- notizie RSS;
- domande Stack Overflow;
- repository GitHub starred;
- risorse salvate.

Il caricamento di una sezione non deve impedire, quando possibile, l'utilizzo delle altre parti dell'interfaccia.

L'indicatore di caricamento utilizza una piccola animazione ispirata a una matita che scrive.

Lo stesso pattern viene riutilizzato nei diversi stati di caricamento dell'interfaccia, adattandone dimensione e posizione al contesto.

L'animazione deve essere semplice, discreta e non distraente.

Gli stati di caricamento devono essere affiancati da stati di errore indipendenti: il fallimento del caricamento di una singola sezione non deve rendere inutilizzabile l'intera pagina.

### Messaggi di errore

Quando un contenuto non può essere caricato, l'interfaccia deve mostrare un messaggio di errore chiaro e riconoscibile.

Il messaggio deve spiegare sinteticamente che il contenuto richiesto non è disponibile, evitando messaggi tecnici provenienti direttamente dal backend.

Quando l'operazione può essere ripetuta, può essere disponibile un'azione per effettuare un nuovo tentativo.

La resa visiva deve:

- distinguere chiaramente lo stato di errore dal normale contenuto;
- rimanere coerente con l'identità grafica del sito;
- non comunicare l'errore esclusivamente tramite il colore;
- mantenere un contrasto adeguato;
- utilizzare eventualmente un'icona o un elemento grafico che rafforzi il significato del messaggio.

Non è necessario introdurre preventivamente un colore di errore dedicato nella palette. Il colore e lo stile definitivi saranno scelti durante la progettazione visuale del componente.

### Icone

La versione attuale utilizza un font icon custom generato attraverso lo strumento https://icomoon.io/.

Nella nuova versione l'iconografia deve utilizzare uno stile coerente.

Le icone sono particolarmente importanti per rappresentare le aree tematiche nella sidebar collassata.

Le icone non devono essere l'unico mezzo per comunicare un'informazione: devono avere un nome accessibile e, quando necessario, tooltip.

La scelta tra font icon, SVG o altra soluzione sarà effettuata nell'analisi tecnica.

### Pulsanti

I pulsanti devono avere una gerarchia visiva coerente e stati chiaramente distinguibili.

Devono essere definiti almeno:

- stato normale;
- hover;
- focus;
- active;
- disabled.

#### Download CV

Il pulsante per scaricare il CV mantiene il richiamo al foglio di carta già presente nella versione attuale.

Il testo può utilizzare `Rock Salt` se rimane sufficientemente leggibile.

#### Copia codice

Il controllo di copia deve essere compatto e integrato nel blocco di codice.

#### Torna ai risultati

Il pulsante **Torna ai risultati** deve essere riconoscibile come azione legata al flusso di ricerca senza assumere maggiore importanza rispetto al titolo dell'articolo.

La resa grafica è ancora da definire.

### Search bar

La search bar rappresenta una delle interazioni principali di Appunti Digitali e deve essere immediatamente disponibile nell'header.

Il campo di ricerca non deve essere nascosto dietro un'icona o richiedere un'animazione di apertura prima di poter essere utilizzato.

L'utente deve poter iniziare a digitare immediatamente, anche mentre l'indice locale necessario alla ricerca è ancora in preparazione.

Se la query viene inserita prima che l'indice sia pronto, il testo digitato deve essere mantenuto e la ricerca deve partire automaticamente non appena i dati necessari diventano disponibili.

La preparazione dell'indice può essere comunicata tramite un piccolo indicatore di caricamento ispirato alla matita utilizzata negli altri stati di loading, senza bloccare o sostituire il campo di ricerca.

La search bar non necessita di una label visibile, perché posizione, contesto e placeholder rendono evidente la sua funzione.

Il campo deve comunque avere un nome accessibile indipendente dal placeholder.

Il placeholder previsto è:

`Cerca negli appunti...`

Devono essere definiti almeno i seguenti stati:

- campo vuoto;
- campo con query;
- focus;
- hover;
- preparazione dell'indice di ricerca;
- ricerca attiva;
- nessun risultato;
- errore nel caricamento dei dati necessari alla ricerca.

Quando è presente una query deve essere disponibile un controllo per cancellarla.

### Pannello laterale

La sidebar deve avere due stati visivi:

- espansa;
- collassata.

Nello stato collassato rimangono visibili le icone delle aree tematiche.

L'area tematica dell'articolo corrente deve essere chiaramente riconoscibile.

Su mobile il pannello diventa un drawer sovrapposto al contenuto.

Il controllo di apertura/chiusura deve avere uno stato di focus evidente.

### Card e sezioni della home

Le sezioni:

- Notizie;
- Stack Overflow;
- GitHub starred;
- Risorse salvate;

devono essere chiaramente distinguibili senza assumere l'aspetto di quattro componenti eccessivamente pesanti.

La gerarchia interna deve privilegiare il titolo della risorsa e mantenere secondari eventuali metadati.

Dato che sarà presente un gran numero di elementi le 4 sezioni avranno un'altezza limitata e sarà possibile scorrere le liste attraverso scrollbar.

### Risultati di ricerca

L'overlay dei risultati deve essere opaco e visivamente separato dal contenuto sottostante.

I risultati devono essere raggruppati per articolo.

Ogni gruppo deve distinguere chiaramente:

- area tematica;
- titolo dell'articolo;
- singole occorrenze.

L'area tematica è rappresentata tramite la relativa icona.

Il termine cercato deve essere evidenziato all'interno degli snippet.

Le singole occorrenze devono avere un feedback visivo chiaro per hover e focus.

### Link

Il sistema utilizza diverse categorie di link che devono essere distinguibili senza creare stili completamente scollegati tra loro.

Devono essere considerati almeno:

- link nelle sezioni informative della home page;
- link di approfondimento associati all'intero articolo;
- fonti o link contestuali associati a un paragrafo;
- link nella sezione di presentazione professionale;
- link esterni presenti nel corpo degli articoli.

I link contestuali associati a un paragrafo possono essere rappresentati come elementi compatti, per esempio chip, se questa soluzione risulta leggibile e non interrompe il flusso del testo.

I link devono avere stati hover e focus chiaramente distinguibili.

### Tabelle

Le tabelle devono mantenere un design semplice e orientato alla leggibilità.

La palette deve privilegiare bianco, nero, grigio e variazioni neutre.

Devono essere chiaramente distinguibili:

- intestazioni;
- righe;
- celle;
- eventuali stati hover, se utili.

Su schermi piccoli le tabelle non devono perdere informazioni.

### Immagini

Le immagini informative presenti negli articoli sono generalmente centrate rispetto al contenuto.

Devono adattarsi alla larghezza disponibile senza perdere proporzioni.

Le immagini non devono essere utilizzate come semplice decorazione quando non aggiungono valore informativo.

### Embed interattivi

Gli embed CodePen e gli eventuali altri playground devono integrarsi visivamente con l'articolo per quanto consentito dal servizio esterno.

Devono risultare distinti dai normali blocchi di codice.

Quando disponibile deve essere presente un collegamento alla risorsa originale.

La resa visiva interna dell'embed può dipendere dal provider esterno, ma lo spazio circostante e la sua integrazione nella pagina devono rimanere coerenti con il design del sito.

### Informazioni di compatibilità

Gli embed di servizi come Can I use devono essere inseriti in modo da non interrompere eccessivamente il flusso dell'articolo.

Quando l'embed completo non aggiunge sufficiente valore può essere preferibile un collegamento contestuale alla fonte originale.

### Scrollbar

Eventuali scrollbar personalizzate possono utilizzare il verde della palette.

La personalizzazione deve rimanere discreta e non deve rendere difficile riconoscere o utilizzare la scrollbar.

## Footer

Il footer deve rimanere semplice e visivamente secondario rispetto al contenuto.

L'indirizzo email deve essere chiaramente riconoscibile come elemento interattivo.

L'effetto di sottolineatura presente all'hover può essere mantenuto e adattato al nuovo stile.

Devono essere previsti anche:

- stato focus;
- feedback dell'azione di copia;
- scelta tra `mailto:` e copia dell'indirizzo.

## Stati dell'interfaccia

I componenti interattivi devono prevedere, quando applicabile:

- default;
- hover;
- focus;
- active;
- disabled;
- loading;
- success;
- error.

Il focus da tastiera deve essere chiaramente visibile e non deve dipendere unicamente da variazioni minime di colore.

### Hover

Lo stato hover non utilizza un colore globale dedicato.

Ogni componente deve fornire un feedback visivo coerente con il proprio aspetto, per esempio tramite:

- sottolineatura;
- variazione dello sfondo;
- variazione controllata del colore;
- lieve cambiamento di enfasi.

Lo stato hover non deve essere l'unico indicatore disponibile per gli elementi interattivi.

### Focus

Gli elementi interattivi devono mostrare uno stato di focus chiaramente visibile quando raggiunti tramite tastiera.

Il focus utilizza una combinazione dei colori blu `#284283` e rosa `#ffbdde`, in modo da rimanere riconoscibile sia sulle superfici chiare sia sugli elementi blu dell'interfaccia.

Il focus non deve coincidere visivamente con lo stato hover e non deve essere rimosso.

La resa definitiva del focus ring verrà verificata sulle tavole visuali e sui componenti reali.

## Motion

Le animazioni devono essere limitate e funzionali.

Eventuali transizioni di:

- apertura/chiusura sidebar;
- apertura/chiusura drawer;
- comparsa dei risultati;
- feedback dei componenti;

devono essere brevi e non devono rallentare l'interazione.

Le preferenze relative a `prefers-reduced-motion` devono essere rispettate.

## Feedback sonori

Il sistema mantiene due brevi suoni associati a:

- apertura del pannello di navigazione;
- chiusura del pannello di navigazione.

I suoni devono avere:

- breve durata;
- volume moderato;
- carattere discreto;
- associazione chiara con l'azione.

Il feedback sonoro è aggiuntivo rispetto al feedback visivo e il sito deve rimanere completamente utilizzabile senza audio.

## Responsive design

Il design system deve supportare almeno:

- layout desktop;
- layout mobile.

Le versioni intermedie devono adattarsi progressivamente senza richiedere necessariamente una composizione grafica separata.

Su mobile:

- la sidebar diventa un drawer;
- la ricerca rimane facilmente raggiungibile;
- le sezioni della home vengono disposte verticalmente;
- l'overlay di ricerca utilizza lo spazio disponibile sotto l'header;
- blocchi di codice e tabelle devono rimanere consultabili senza perdita di contenuto.

## Accessibilità visiva

Il design system deve garantire:

- contrasto adeguato tra testo e sfondo;
- focus visibile;
- target interattivi sufficientemente ampi;
- leggibilità delle dimensioni tipografiche;
- comprensibilità dell'interfaccia anche senza colore;
- leggibilità del syntax highlighting;
- distinzione chiara tra testo, link, codice ed elementi interattivi.