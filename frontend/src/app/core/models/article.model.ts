/**
 * Rappresenta un link esterno associato a un articolo.
 */
export interface ExternalLink {

  /**
   * Testo utilizzato per identificare il collegamento.
   */
  title: string;

  /**
   * URL della risorsa esterna.
   */
  url: string;
}

/**
 * Rappresenta un articolo tecnico restituito dalle API Drupal.
 *
 * Il modello è indipendente dalla struttura interna dei content type Drupal: i campi vengono normalizzati dal backend prima di essere esposti al frontend.
 */
export interface Article {

  /**
   * Identificativo univoco dell'articolo.
   */
  id: number;

  /**
   * Titolo pubblico dell'articolo.
   */
  title: string;

  /**
   * Identificativo dell'area tematica a cui appartiene l'articolo.
   */
  area: string;

  /**
   * Contenuto HTML dell'articolo processato da Drupal.
   */
  body: string;

  /**
   * Link di approfondimento associati all'articolo.
   */
  externalLinks: ExternalLink[];

  /**
   * Peso utilizzato per determinare l'ordinamento dell'articolo all'interno della relativa area tematica.
   */
  weight: number;
}
