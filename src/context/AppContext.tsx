import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Sponsor, Bundle, SponsorToewijzing, AppState } from '../types';

interface AppContextType extends AppState {
  login: (username: string, wachtwoord: string) => boolean;
  logout: () => void;
  addSponsor: (sponsor: Omit<Sponsor, 'id' | 'aangemaakt'>) => void;
  updateSponsor: (id: string, sponsor: Partial<Sponsor>) => void;
  deleteSponsor: (id: string) => void;
  addBundle: (bundle: Omit<Bundle, 'id' | 'aangemaakt'>) => void;
  updateBundle: (id: string, bundle: Partial<Bundle>) => void;
  deleteBundle: (id: string) => void;
  assignSponsor: (
    sponsorId: string,
    gebruikerId: string,
    bedrag: number,
    werkelijkBedrag?: number,
    logoKlaar?: boolean,
    contantKlaar?: boolean,
    vrijkaartenKlaar?: boolean,
    opmerkingen?: string
  ) => void;
  updateToewijzing: (id: string, updates: Partial<SponsorToewijzing>) => void;
  addUser: (user: { username: string; naam: string; wachtwoord: string; rol: 'admin' | 'gebruiker' }) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  completeSponsor: (
    toewijzingId: string,
    data: {
      bedrag: number;
      bundleTypes: string[];
      logoKlaar: boolean;
      opmerkingen?: string;
      voltooideOp?: Date;
    }
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockUsers: User[] = [
  { id: '1', username: 'admin', naam: 'Admin', wachtwoord: 'admin', rol: 'admin' },
  { id: '2', username: 'jan', naam: 'Jan Jansen', wachtwoord: 'test', rol: 'gebruiker' },
  { id: '3', username: 'marie', naam: 'Marie Pietersen', wachtwoord: 'test', rol: 'gebruiker' },
  { id: '4', username: 'tom', naam: 'Tom van Bergen', wachtwoord: 'test', rol: 'gebruiker' },
  { id: '5', username: 'lisa', naam: 'Lisa de Vries', wachtwoord: 'test', rol: 'gebruiker' },
  { id: '6', username: 'piet', naam: 'Piet Bakker', wachtwoord: 'test', rol: 'gebruiker' },
];

const mockSponsors: Sponsor[] = [
  {
    id: '1',
    naam: 'Bakkerij Jansen',
    contactpersoon: 'Henk Jansen',
    email: 'henk@bakkerijjansen.nl',
    telefoon: '06-12345678',
    adres: 'Hoofdstraat 123, Amsterdam',
    beschrijving: 'Lokale bakkerij die graag lokale initiatieven steunt',
    targetBedrag: 500,
    aangemaakt: new Date('2024-01-15'),
  },
  {
    id: '2',
    naam: 'Supermarkt De Vriendelijke Buurt',
    contactpersoon: 'Sandra de Wit',
    email: 'sandra@vriendelijkebuurt.nl',
    telefoon: '06-87654321',
    adres: 'Winkelstraat 45, Utrecht',
    beschrijving: 'Supermarkt die actief betrokken is bij de lokale gemeenschap',
    targetBedrag: 1000,
    aangemaakt: new Date('2024-01-20'),
  },
  {
    id: '3',
    naam: 'Garage Van der Berg',
    contactpersoon: 'Kees van der Berg',
    email: 'kees@garagevdberg.nl',
    telefoon: '06-11223344',
    adres: 'Industrieweg 78, Rotterdam',
    beschrijving: 'Familiebedrijf dat graag de jeugd ondersteunt',
    targetBedrag: 750,
    aangemaakt: new Date('2024-01-25'),
  },
  {
    id: '4',
    naam: 'Restaurant De Gouden Lepel',
    contactpersoon: 'Anna Smit',
    email: 'anna@goudenelepel.nl',
    telefoon: '06-55667788',
    adres: 'Marktplein 12, Den Haag',
    beschrijving: 'Restaurant dat lokale verenigingen graag steunt',
    targetBedrag: 300,
    aangemaakt: new Date('2024-02-01'),
  },
  {
    id: '5',
    naam: 'Bouwbedrijf Hendriks',
    contactpersoon: 'Rob Hendriks',
    email: 'rob@bouwbedrijfhendriks.nl',
    telefoon: '06-99887766',
    adres: 'Bouwstraat 56, Eindhoven',
    beschrijving: 'Bouwbedrijf met hart voor de gemeenschap',
    targetBedrag: 1200,
    aangemaakt: new Date('2024-02-05'),
  },
];

const mockBundles: Bundle[] = [
  {
    id: '1',
    naam: 'Brons',
    beschrijving: 'Basis sponsorpakket',
    prijs: 250,
    aangemaakt: new Date('2024-01-01'),
  },
  {
    id: '2',
    naam: 'Zilver',
    beschrijving: 'Standaard sponsorpakket',
    prijs: 500,
    aangemaakt: new Date('2024-01-01'),
  },
  {
    id: '3',
    naam: 'Goud',
    beschrijving: 'Premium sponsorpakket',
    prijs: 1000,
    aangemaakt: new Date('2024-01-01'),
  },
  {
    id: '4',
    naam: 'Platina',
    beschrijving: 'Exclusief sponsorpakket',
    prijs: 2000,
    aangemaakt: new Date('2024-01-01'),
  },
];

const mockToewijzingen: SponsorToewijzing[] = [
  {
    id: '1',
    sponsorId: '1',
    gebruikerId: '2',
    status: 'voltooid',
    toegewezenOp: new Date('2024-01-25'),
    bedrag: 500,
    werkelijkBedrag: 500,
    logoKlaar: true,
    contantKlaar: true,
    vrijkaartenKlaar: false,
    opmerkingen: 'Zeer tevreden met de samenwerking',
  },
  {
    id: '2',
    sponsorId: '2',
    gebruikerId: '3',
    status: 'bezig',
    toegewezenOp: new Date('2024-02-01'),
    bedrag: 0,
  },
  {
    id: '3',
    sponsorId: '3',
    gebruikerId: '4',
    status: 'voltooid',
    toegewezenOp: new Date('2024-02-03'),
    bedrag: 750,
    werkelijkBedrag: 750,
    logoKlaar: true,
    contantKlaar: false,
    vrijkaartenKlaar: false,
    opmerkingen: 'Goede samenwerking, willen volgend jaar weer meedoen',
  },
  {
    id: '4',
    sponsorId: '4',
    gebruikerId: '5',
    status: 'toegewezen',
    toegewezenOp: new Date('2024-02-05'),
    bedrag: 0,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [sponsors, setSponsors] = useState<Sponsor[]>(mockSponsors);
  const [bundles, setBundles] = useState<Bundle[]>(mockBundles);
  const [toewijzingen, setToewijzingen] = useState<SponsorToewijzing[]>(mockToewijzingen);

  const login = (username: string, wachtwoord: string): boolean => {
    const user = users.find(u => u.username === username && u.wachtwoord === wachtwoord);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const addSponsor = (sponsorData: Omit<Sponsor, 'id' | 'aangemaakt'>) => {
    const newSponsor: Sponsor = {
      ...sponsorData,
      id: crypto.randomUUID(),
      aangemaakt: new Date(),
    };
    setSponsors(prev => [...prev, newSponsor]);
  };

  const updateSponsor = (id: string, updates: Partial<Sponsor>) => {
    setSponsors(prev => prev.map(sponsor => 
      sponsor.id === id ? { ...sponsor, ...updates } : sponsor
    ));
  };

  const deleteSponsor = (id: string) => {
    setSponsors(prev => prev.filter(sponsor => sponsor.id !== id));
    setToewijzingen(prev => prev.filter(t => t.sponsorId !== id));
  };

  const addBundle = (bundleData: Omit<Bundle, 'id' | 'aangemaakt'>) => {
    const newBundle: Bundle = {
      ...bundleData,
      id: crypto.randomUUID(),
      aangemaakt: new Date(),
    };
    setBundles(prev => [...prev, newBundle]);
  };

  const updateBundle = (id: string, updates: Partial<Bundle>) => {
    setBundles(prev => prev.map(bundle => 
      bundle.id === id ? { ...bundle, ...updates } : bundle
    ));
  };

  const deleteBundle = (id: string) => {
    setBundles(prev => prev.filter(bundle => bundle.id !== id));
  };

  const assignSponsor = (
    sponsorId: string,
    gebruikerId: string,
    bedrag: number,
    werkelijkBedrag?: number,
    logoKlaar?: boolean,
    contantKlaar?: boolean,
    vrijkaartenKlaar?: boolean,
    opmerkingen?: string
  ) => {
    setToewijzingen(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sponsorId,
        gebruikerId,
        status: 'toegewezen',
        toegewezenOp: new Date(),
        bedrag,
        werkelijkBedrag,
        logoKlaar,
        contantKlaar,
        vrijkaartenKlaar,
        opmerkingen,
      }
    ]);
  };

  const updateToewijzing = (id: string, updates: Partial<SponsorToewijzing>) => {
    setToewijzingen(prev => prev.map(t =>
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const addUser = (user: { username: string; naam: string; wachtwoord: string; rol: 'admin' | 'gebruiker' }) => {
    setUsers(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...user,
      }
    ]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setToewijzingen(prev => prev.filter(t => t.gebruikerId !== id));
  };

  const completeSponsor = (
    toewijzingId: string,
    data: {
      bedrag: number;
      bundleTypes: string[];
      logoKlaar: boolean;
      opmerkingen?: string;
      voltooideOp?: Date;
    }
  ) => {
    setToewijzingen(prev =>
      prev.map(t =>
        t.id === toewijzingId
          ? {
              ...t,
              status: 'voltooid',
              bedrag: data.bedrag,
              bundleTypes: data.bundleTypes,
              logoKlaar: data.logoKlaar,
              opmerkingen: data.opmerkingen,
              voltooideOp: data.voltooideOp ?? new Date(),
            }
          : t
      )
    );
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      sponsors,
      bundles,
      toewijzingen,
      login,
      logout,
      addSponsor,
      updateSponsor,
      deleteSponsor,
      addBundle,
      updateBundle,
      deleteBundle,
      assignSponsor,
      updateToewijzing,
      addUser,
      updateUser,
      deleteUser,
      completeSponsor,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}