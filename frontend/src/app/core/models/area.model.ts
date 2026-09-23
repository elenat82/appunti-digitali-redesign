/**
 * Rappresenta un'area tematica esposta da Drupal.
 *
 * I metadati dell'area vengono utilizzati per costruire dinamicamente la navigazione pubblica del sito.
 *
 */
export interface Area {
  
  /** Identificativo tecnico utilizzato dalle API. */
  id: string;

  /** Etichetta pubblica mostrata nell'interfaccia. */
  label: string;

  /** URL pubblico dell'icona SVG associata all'area. */
  iconUrl: string;

  /** Valore di ordinamento definito in Drupal. */
  weight: number;
}
