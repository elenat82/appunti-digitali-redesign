# Redesign del sito Appunti Digitali

Appunti Digitali è una knowledge base personale pubblica dedicata alla programmazione web.

Il redesign ha l'obiettivo di trasformare il sito da blog tecnico a strumento di consultazione rapido, accessibile e ricercabile, ottimizzato per trovare immediatamente informazioni, esempi di codice, comandi, link e spiegazioni teoriche.

Il progetto ha anche valore portfolio: deve dimostrare competenze moderne su Drupal 11, Angular, architettura decoupled, accessibilità, SEO, migrazione contenuti e progettazione orientata ai requisiti.

## Obiettivi principali

- migrazione da Drupal 8 a Drupal 11;
- frontend con Angular moderno;
- miglioramento della funzione di ricerca;
- integrazione web clipper tramite Chrome Extension e custom REST endpoint Drupal;
- maggiore attenzione ad accessibilità, SEO e performance.

## Comandi utili

### Backend Drupal

I comandi backend devono essere eseguiti dalla directory `backend/`.

#### Cache rebuild

```bash
ddev drush cr
```

#### Esportazione della configurazione

```bash
ddev drush cex -y
```

#### Importazione della configurazione

```bash
ddev drush cim -y
```

#### Coding standards

Verifica

```bash
ddev exec ./vendor/bin/phpcs
```

Correzione automatica dei problemi supportati

```bash
ddev exec ./vendor/bin/phpcbf
```

#### Test

Tutti i test funzionali del modulo custom

```bash
ddev exec ./vendor/bin/phpunit -c phpunit.xml \
  web/modules/custom/appunti_digitali/tests/src/Functional
```

Un singolo test

```bash
ddev exec ./vendor/bin/phpunit -c phpunit.xml \
  web/modules/custom/appunti_digitali/tests/src/Functional/ArticlesEndpointTest.php
```

### Frontend Angular

I comandi frontend devono essere eseguiti dalla directory `frontend/`.

#### Test

```bash
npm test -- --watch=false
```

#### Build di produzione

```bash
npm run build
```

#### Generazione della documentazione

```bash
npm run docs
```

La documentazione generata viene salvata nella directory `documentation/`, esclusa dal repository.

#### Server locale della documentazione

```bash
npm run docs:serve
```

In ambiente WSL la documentazione può essere aperta dal browser Windows tramite:

`http://localhost:8080`

