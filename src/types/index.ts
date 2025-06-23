export interface User {
  id: string;
  username: string;
  naam: string;
  wachtwoord: string;
  rol: 'admin' | 'gebruiker';
}

export interface Sponsor {
  id: string;
  naam: string;
  contactpersoon: string;
  email: string;
  telefoon: string;
  adres: string;
  beschrijving: string;
  targetBedrag: number;
  aangemaakt: Date;
}

export interface Bundle {
  id: string;
  naam: string;
  beschrijving: string;
  prijs: number;
  aangemaakt: Date;
}

export interface SponsorToewijzing {
  id: string;
  sponsorId: string;
  gebruikerId: string;
  status: 'toegewezen' | 'bezig' | 'voltooid' | 'afgewezen';
  toegewezenOp: Date;
  bedrag: number;
  werkelijkBedrag?: number;
  bundleTypes?: string[]; // <-- voeg deze regel toe
  logoKlaar?: boolean;
  contantKlaar?: boolean;
  vrijkaartenKlaar?: boolean;
  opmerkingen?: string;
  voltooideOp?: Date;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  sponsors: Sponsor[];
  bundles: Bundle[];
  toewijzingen: SponsorToewijzing[];
}