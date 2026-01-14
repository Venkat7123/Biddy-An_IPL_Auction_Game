
import { Team, Player, Role } from './types';

export const TEAMS: Team[] = [
  { id: 'csk', name: 'Chennai Super Kings', shortName: 'CSK', color: '#FFFF00', secondaryColor: '#00539B', logo: '🦁', logoUrl: 'https://documents.iplt20.com/ipl/CSK/logos/Logooutline/CSKoutline.png' },
  { id: 'mi', name: 'Mumbai Indians', shortName: 'MI', color: '#004BA0', secondaryColor: '#D1AB3E', logo: '🌪️', logoUrl: 'https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png' },
  { id: 'rcb', name: 'Royal Challengers Bengaluru', shortName: 'RCB', color: '#2B2A29', secondaryColor: '#D11A2A', logo: '👑', logoUrl: 'https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png' },
  { id: 'kkr', name: 'Kolkata Knight Riders', shortName: 'KKR', color: '#3A225D', secondaryColor: '#B3A123', logo: '⚔️', logoUrl: 'https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png' },
  { id: 'rr', name: 'Rajasthan Royals', shortName: 'RR', color: '#EA1A85', secondaryColor: '#004B8D', logo: '🐘', logoUrl: 'https://documents.iplt20.com/ipl/RR/Logos/RR_Logo.png' },
  { id: 'srh', name: 'Sunrisers Hyderabad', shortName: 'SRH', color: '#FF822E', secondaryColor: '#000000', logo: '🦅', logoUrl: 'https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png' },
  { id: 'dc', name: 'Delhi Capitals', shortName: 'DC', color: '#00008B', secondaryColor: '#FF0000', logo: '🐯', logoUrl: 'https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png' },
  { id: 'pbks', name: 'Punjab Kings', shortName: 'PBKS', color: '#D71920', secondaryColor: '#FDD017', logo: '🦁', logoUrl: 'https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png' },
  { id: 'gt', name: 'Gujarat Titans', shortName: 'GT', color: '#1B2133', secondaryColor: '#BC9412', logo: '⚡', logoUrl: 'https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png' },
  { id: 'lsg', name: 'Lucknow Super Giants', shortName: 'LSG', color: '#0057E7', secondaryColor: '#FFD700', logo: '🏹', logoUrl: 'https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png' },
];

export const MAX_PURSE = 120;
export const MIN_SQUAD = 18;
export const MAX_SQUAD = 25;
export const MAX_OVERSEAS = 8;

export const mapSlab = (setNo: number): string => {
  if (setNo === 1) return 'M1';
  if (setNo === 2) return 'M2';
  if (setNo === 3) return 'BA1';
  if (setNo === 4) return 'AL1';
  if (setNo === 5) return 'WK1';
  if (setNo === 6) return 'FA1';
  if (setNo === 7) return 'SP1';
  if (setNo === 8) return 'UBA1';
  if (setNo === 9) return 'UAL1';
  if (setNo === 10) return 'UWK1';
  if (setNo === 11) return 'UFA1';
  if (setNo === 12) return 'USP1';
  if (setNo === 13) return 'BA2';
  if (setNo === 14) return 'AL2';
  if (setNo === 15) return 'WK2';
  if (setNo === 16) return 'FA2';
  if (setNo === 17) return 'SP2';
  return `SET${setNo}`;
};

export const PLAYERS: Player[] = [
  { id: 'p1', name: 'Jos Buttler', country: 'England', role: 'WK', basePrice: 2.0, cappedUncapped: 'Capped', age: 34, setNo: 1, slabCategory: mapSlab(1), previousIPLTeams: 'MI, RR', rtms: 'RR', isOverseas: true, formerTeamId: 'rr' },
  { id: 'p2', name: 'Shreyas Iyer', country: 'India', role: 'BAT', basePrice: 2.0, cappedUncapped: 'Capped', age: 30, setNo: 1, slabCategory: mapSlab(1), previousIPLTeams: 'DC, KKR', rtms: 'KKR', isOverseas: false, formerTeamId: 'kkr' },
  { id: 'p3', name: 'Rishabh Pant', country: 'India', role: 'WK', basePrice: 2.0, cappedUncapped: 'Capped', age: 27, setNo: 1, slabCategory: mapSlab(1), previousIPLTeams: 'DC', rtms: 'DC', isOverseas: false, formerTeamId: 'dc' },
  { id: 'p4', name: 'Kagiso Rabada', country: 'South Africa', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 29, setNo: 1, slabCategory: mapSlab(1), previousIPLTeams: 'DC, PBKS', rtms: 'PBKS', isOverseas: true, formerTeamId: 'pbks' },
  { id: 'p5', name: 'Arshdeep Singh', country: 'India', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 26, setNo: 1, slabCategory: mapSlab(1), previousIPLTeams: 'PBKS', rtms: 'PBKS', isOverseas: false, formerTeamId: 'pbks' },
  { id: 'p6', name: 'Mitchell Starc', country: 'Australia', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 35, setNo: 1, slabCategory: mapSlab(1), previousIPLTeams: 'RCB, KKR', rtms: 'KKR', isOverseas: true, formerTeamId: 'kkr' },

  { id: 'p7', name: 'Yuzvendra Chahal', country: 'India', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 34, setNo: 2, slabCategory: mapSlab(2), previousIPLTeams: 'MI, RCB, RR', rtms: 'RR', isOverseas: false, formerTeamId: 'rr' },
  { id: 'p8', name: 'Liam Livingstone', country: 'England', role: 'AR', basePrice: 2.0, cappedUncapped: 'Capped', age: 31, setNo: 2, slabCategory: mapSlab(2), previousIPLTeams: 'RR, PBKS', rtms: 'PBKS', isOverseas: true, formerTeamId: 'pbks' },
  { id: 'p9', name: 'David Miller', country: 'South Africa', role: 'BAT', basePrice: 1.5, cappedUncapped: 'Capped', age: 35, setNo: 2, slabCategory: mapSlab(2), previousIPLTeams: 'PBKS, RR, GT', rtms: 'GT', isOverseas: true, formerTeamId: 'gt' },
  { id: 'p10', name: 'KL Rahul', country: 'India', role: 'WK', basePrice: 2.0, cappedUncapped: 'Capped', age: 32, setNo: 2, slabCategory: mapSlab(2), previousIPLTeams: 'SRH, RCB, PBKS, LSG', rtms: 'LSG', isOverseas: false, formerTeamId: 'lsg' },
  { id: 'p11', name: 'Mohammed Shami', country: 'India', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 34, setNo: 2, slabCategory: mapSlab(2), previousIPLTeams: 'KKR, PBKS, GT', rtms: 'GT', isOverseas: false, formerTeamId: 'gt' },
  { id: 'p12', name: 'Mohammed Siraj', country: 'India', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 31, setNo: 2, slabCategory: mapSlab(2), previousIPLTeams: 'SRH, RCB', rtms: 'RCB', isOverseas: false, formerTeamId: 'rcb' },

  { id: 'p13', name: 'Harry Brook', country: 'England', role: 'BAT', basePrice: 2.0, cappedUncapped: 'Capped', age: 26, setNo: 3, slabCategory: mapSlab(3), previousIPLTeams: 'SRH, DC', rtms: 'DC', isOverseas: true, formerTeamId: 'dc' },
  { id: 'p14', name: 'Devon Conway', country: 'New Zealand', role: 'BAT', basePrice: 2.0, cappedUncapped: 'Capped', age: 33, setNo: 3, slabCategory: mapSlab(3), previousIPLTeams: 'CSK', rtms: 'CSK', isOverseas: true, formerTeamId: 'csk' },
  { id: 'p15', name: 'Jake Fraser-McGurk', country: 'Australia', role: 'BAT', basePrice: 2.0, cappedUncapped: 'Capped', age: 22, setNo: 3, slabCategory: mapSlab(3), previousIPLTeams: 'DC', rtms: 'DC', isOverseas: true, formerTeamId: 'dc' },
  { id: 'p16', name: 'Aiden Markram', country: 'South Africa', role: 'BAT', basePrice: 2.0, cappedUncapped: 'Capped', age: 30, setNo: 3, slabCategory: mapSlab(3), previousIPLTeams: 'PBKS, SRH', rtms: 'SRH', isOverseas: true, formerTeamId: 'srh' },
  { id: 'p17', name: 'Devdutt Padikkal', country: 'India', role: 'BAT', basePrice: 2.0, cappedUncapped: 'Capped', age: 24, setNo: 3, slabCategory: mapSlab(3), previousIPLTeams: 'RCB, RR, LSG', rtms: 'LSG', isOverseas: false, formerTeamId: 'lsg' },
  { id: 'p18', name: 'Rahul Tripathi', country: 'India', role: 'BAT', basePrice: 0.75, cappedUncapped: 'Capped', age: 34, setNo: 3, slabCategory: mapSlab(3), previousIPLTeams: 'RPS, RR, KKR, SRH', rtms: '', isOverseas: false },
  { id: 'p19', name: 'David Warner', country: 'Australia', role: 'BAT', basePrice: 2.0, cappedUncapped: 'Capped', age: 38, setNo: 3, slabCategory: mapSlab(3), previousIPLTeams: 'SRH, DC', rtms: 'DC', isOverseas: true, formerTeamId: 'dc' },

  { id: 'p20', name: 'Ravichandran Ashwin', country: 'India', role: 'AR', basePrice: 2.0, cappedUncapped: 'Capped', age: 38, setNo: 4, slabCategory: mapSlab(4), previousIPLTeams: 'CSK, RPS, PBKS, DC, RR', rtms: 'RR', isOverseas: false, formerTeamId: 'rr' },
  { id: 'p21', name: 'Venkatesh Iyer', country: 'India', role: 'AR', basePrice: 2.0, cappedUncapped: 'Capped', age: 30, setNo: 4, slabCategory: mapSlab(4), previousIPLTeams: 'KKR', rtms: 'KKR', isOverseas: false, formerTeamId: 'kkr' },
  { id: 'p22', name: 'Mitchell Marsh', country: 'Australia', role: 'AR', basePrice: 2.0, cappedUncapped: 'Capped', age: 33, setNo: 4, slabCategory: mapSlab(4), previousIPLTeams: 'DCH, PWI, RPS, SRH, DC', rtms: 'DC', isOverseas: true, formerTeamId: 'dc' },
  { id: 'p23', name: 'Glenn Maxwell', country: 'Australia', role: 'AR', basePrice: 2.0, cappedUncapped: 'Capped', age: 36, setNo: 4, slabCategory: mapSlab(4), previousIPLTeams: 'DC, MI, PBKS, RCB', rtms: 'RCB', isOverseas: true, formerTeamId: 'rcb' },
  { id: 'p24', name: 'Harshal Patel', country: 'India', role: 'AR', basePrice: 2.0, cappedUncapped: 'Capped', age: 34, setNo: 4, slabCategory: mapSlab(4), previousIPLTeams: 'DC, RCB, PBKS', rtms: 'PBKS', isOverseas: false, formerTeamId: 'pbks' },
  { id: 'p25', name: 'Rachin Ravindra', country: 'New Zealand', role: 'AR', basePrice: 1.5, cappedUncapped: 'Capped', age: 25, setNo: 4, slabCategory: mapSlab(4), previousIPLTeams: 'CSK', rtms: 'CSK', isOverseas: true, formerTeamId: 'csk' },
  { id: 'p26', name: 'Marcus Stoinis', country: 'Australia', role: 'AR', basePrice: 2.0, cappedUncapped: 'Capped', age: 35, setNo: 4, slabCategory: mapSlab(4), previousIPLTeams: 'PBKS, RCB, DC, LSG', rtms: 'LSG', isOverseas: true, formerTeamId: 'lsg' },

  { id: 'p27', name: 'Jonny Bairstow', country: 'England', role: 'WK', basePrice: 2.0, cappedUncapped: 'Capped', age: 35, setNo: 5, slabCategory: mapSlab(5), previousIPLTeams: 'SRH, PBKS', rtms: 'PBKS', isOverseas: true, formerTeamId: 'pbks' },
  { id: 'p28', name: 'Quinton de Kock', country: 'South Africa', role: 'WK', basePrice: 2.0, cappedUncapped: 'Capped', age: 32, setNo: 5, slabCategory: mapSlab(5), previousIPLTeams: 'SRH, DC, RCB, MI, LSG', rtms: 'LSG', isOverseas: true, formerTeamId: 'lsg' },
  { id: 'p29', name: 'Rahmanullah Gurbaz', country: 'Afghanistan', role: 'WK', basePrice: 2.0, cappedUncapped: 'Capped', age: 23, setNo: 5, slabCategory: mapSlab(5), previousIPLTeams: 'GT, KKR', rtms: 'KKR', isOverseas: true, formerTeamId: 'kkr' },
  { id: 'p30', name: 'Ishan Kishan', country: 'India', role: 'WK', basePrice: 2.0, cappedUncapped: 'Capped', age: 26, setNo: 5, slabCategory: mapSlab(5), previousIPLTeams: 'GL, MI', rtms: 'MI', isOverseas: false, formerTeamId: 'mi' },
  { id: 'p31', name: 'Phil Salt', country: 'England', role: 'WK', basePrice: 2.0, cappedUncapped: 'Capped', age: 28, setNo: 5, slabCategory: mapSlab(5), previousIPLTeams: 'DC, KKR', rtms: 'KKR', isOverseas: true, formerTeamId: 'kkr' },
  { id: 'p32', name: 'Jitesh Sharma', country: 'India', role: 'WK', basePrice: 1.0, cappedUncapped: 'Capped', age: 31, setNo: 5, slabCategory: mapSlab(5), previousIPLTeams: 'MI, PBKS', rtms: 'PBKS', isOverseas: false, formerTeamId: 'pbks' },

  { id: 'p33', name: 'Khaleel Ahmed', country: 'India', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 27, setNo: 6, slabCategory: mapSlab(6), previousIPLTeams: 'SRH, DC', rtms: 'DC', isOverseas: false, formerTeamId: 'dc' },
  { id: 'p34', name: 'Trent Boult', country: 'New Zealand', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 35, setNo: 6, slabCategory: mapSlab(6), previousIPLTeams: 'SRH, DC, MI, RR', rtms: 'RR', isOverseas: true, formerTeamId: 'rr' },
  { id: 'p35', name: 'Josh Hazlewood', country: 'Australia', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 34, setNo: 6, slabCategory: mapSlab(6), previousIPLTeams: 'CSK, RCB', rtms: '', isOverseas: true },
  { id: 'p36', name: 'Avesh Khan', country: 'India', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 28, setNo: 6, slabCategory: mapSlab(6), previousIPLTeams: 'RCB, DC, LSG, RR', rtms: 'RR', isOverseas: false, formerTeamId: 'rr' },
  { id: 'p37', name: 'Prasidh Krishna', country: 'India', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 29, setNo: 6, slabCategory: mapSlab(6), previousIPLTeams: 'KKR, RR', rtms: '', isOverseas: false },
  { id: 'p38', name: 'T. Natarajan', country: 'India', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 33, setNo: 6, slabCategory: mapSlab(6), previousIPLTeams: 'PBKS, SRH', rtms: 'SRH', isOverseas: false, formerTeamId: 'srh' },
  { id: 'p39', name: 'Anrich Nortje', country: 'South Africa', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 31, setNo: 6, slabCategory: mapSlab(6), previousIPLTeams: 'DC', rtms: 'DC', isOverseas: true, formerTeamId: 'dc' },

  { id: 'p40', name: 'Noor Ahmad', country: 'Afghanistan', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 20, setNo: 7, slabCategory: mapSlab(7), previousIPLTeams: 'GT', rtms: 'GT', isOverseas: true, formerTeamId: 'gt' },
  { id: 'p41', name: 'Rahul Chahar', country: 'India', role: 'BOWL', basePrice: 1.0, cappedUncapped: 'Capped', age: 25, setNo: 7, slabCategory: mapSlab(7), previousIPLTeams: 'RPS, MI, PBKS', rtms: 'PBKS', isOverseas: false, formerTeamId: 'pbks' },
  { id: 'p42', name: 'Wanindu Hasaranga', country: 'Sri Lanka', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 27, setNo: 7, slabCategory: mapSlab(7), previousIPLTeams: 'RCB, SRH', rtms: '', isOverseas: true },
  { id: 'p43', name: 'Waqar Salamkheil', country: 'Afghanistan', role: 'BOWL', basePrice: 0.75, cappedUncapped: 'Capped', age: 23, setNo: 7, slabCategory: mapSlab(7), previousIPLTeams: '', rtms: '', isOverseas: true },
  { id: 'p44', name: 'Maheesh Theekshana', country: 'Sri Lanka', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 24, setNo: 7, slabCategory: mapSlab(7), previousIPLTeams: 'CSK', rtms: 'CSK', isOverseas: true, formerTeamId: 'csk' },
  { id: 'p45', name: 'Adam Zampa', country: 'Australia', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 32, setNo: 7, slabCategory: mapSlab(7), previousIPLTeams: 'RPS, RCB, RR', rtms: '', isOverseas: true },
  { id: 'p46', name: 'Yash Dhull', country: 'India', role: 'BAT', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 22, setNo: 8, slabCategory: mapSlab(8), previousIPLTeams: 'DC', rtms: 'DC', isOverseas: false, formerTeamId: 'dc' },
  { id: 'p47', name: 'Abhinav Manohar', country: 'India', role: 'BAT', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 30, setNo: 8, slabCategory: mapSlab(8), previousIPLTeams: 'GT', rtms: 'GT', isOverseas: false, formerTeamId: 'gt' },
  { id: 'p48', name: 'Karun Nair', country: 'India', role: 'BAT', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 33, setNo: 8, slabCategory: mapSlab(8), previousIPLTeams: 'RCB, RR, DD, PBKS, LSG', rtms: '', isOverseas: false },
  { id: 'p49', name: 'Angkrish Raghuvanshi', country: 'India', role: 'BAT', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 20, setNo: 8, slabCategory: mapSlab(8), previousIPLTeams: 'KKR', rtms: 'KKR', isOverseas: false, formerTeamId: 'kkr' },
  { id: 'p50', name: 'Anmolpreet Singh', country: 'India', role: 'BAT', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 27, setNo: 8, slabCategory: mapSlab(8), previousIPLTeams: 'MI, SRH', rtms: 'SRH', isOverseas: false, formerTeamId: 'srh' },
  { id: 'p51', name: 'Atharva Taide', country: 'India', role: 'BAT', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 24, setNo: 8, slabCategory: mapSlab(8), previousIPLTeams: 'PBKS', rtms: 'PBKS', isOverseas: false, formerTeamId: 'pbks' },
  { id: 'p52', name: 'Nehal Wadhera', country: 'India', role: 'BAT', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 24, setNo: 8, slabCategory: mapSlab(8), previousIPLTeams: 'MI', rtms: 'MI', isOverseas: false, formerTeamId: 'mi' },

  { id: 'p53', name: 'Harpreet Brar', country: 'India', role: 'AR', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 29, setNo: 9, slabCategory: mapSlab(9), previousIPLTeams: 'PBKS', rtms: 'PBKS', isOverseas: false, formerTeamId: 'pbks' },
  { id: 'p54', name: 'Naman Dhir', country: 'India', role: 'AR', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 25, setNo: 9, slabCategory: mapSlab(9), previousIPLTeams: 'MI', rtms: 'MI', isOverseas: false, formerTeamId: 'mi' },
  { id: 'p55', name: 'Mahipal Lomror', country: 'India', role: 'AR', basePrice: 0.50, cappedUncapped: 'Uncapped', age: 25, setNo: 9, slabCategory: mapSlab(9), previousIPLTeams: 'RR, RCB', rtms: 'RCB', isOverseas: false, formerTeamId: 'rcb' },
  { id: 'p56', name: 'Sameer Rizvi', country: 'India', role: 'AR', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 21, setNo: 9, slabCategory: mapSlab(9), previousIPLTeams: 'CSK', rtms: 'CSK', isOverseas: false, formerTeamId: 'csk' },
  { id: 'p57', name: 'Abdul Samad', country: 'India', role: 'AR', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 23, setNo: 9, slabCategory: mapSlab(9), previousIPLTeams: 'SRH', rtms: 'SRH', isOverseas: false, formerTeamId: 'srh' },
  { id: 'p58', name: 'Vijay Shankar', country: 'India', role: 'AR', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 34, setNo: 9, slabCategory: mapSlab(9), previousIPLTeams: 'CSK, DC, SRH, GT', rtms: '', isOverseas: false },
  { id: 'p59', name: 'Ashutosh Sharma', country: 'India', role: 'AR', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 26, setNo: 9, slabCategory: mapSlab(9), previousIPLTeams: 'PBKS', rtms: 'PBKS', isOverseas: false, formerTeamId: 'pbks' },
  { id: 'p60', name: 'Nishant Sindhu', country: 'India', role: 'AR', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 20, setNo: 9, slabCategory: mapSlab(9), previousIPLTeams: 'CSK', rtms: 'CSK', isOverseas: false, formerTeamId: 'csk' },
  { id: 'p61', name: 'Utkarsh Singh', country: 'India', role: 'AR', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 26, setNo: 9, slabCategory: mapSlab(9), previousIPLTeams: 'PBKS', rtms: '', isOverseas: false },

  { id: 'p62', name: 'Aryan Juyal', country: 'India', role: 'WK', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 23, setNo: 10, slabCategory: mapSlab(10), previousIPLTeams: 'MI', rtms: '', isOverseas: false },
  { id: 'p63', name: 'Kumar Kushagra', country: 'India', role: 'WK', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 20, setNo: 10, slabCategory: mapSlab(10), previousIPLTeams: 'GT', rtms: 'DC', isOverseas: false, formerTeamId: 'dc' },
  { id: 'p64', name: 'Robin Minz', country: 'India', role: 'WK', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 22, setNo: 10, slabCategory: mapSlab(10), previousIPLTeams: 'GT', rtms: '', isOverseas: false },
  { id: 'p65', name: 'Anuj Rawat', country: 'India', role: 'WK', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 25, setNo: 10, slabCategory: mapSlab(10), previousIPLTeams: 'RR, RCB', rtms: 'RCB', isOverseas: false, formerTeamId: 'rcb' },
  { id: 'p66', name: 'Luvnith Sisodia', country: 'India', role: 'WK', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 25, setNo: 10, slabCategory: mapSlab(10), previousIPLTeams: 'RCB', rtms: '', isOverseas: false },
  { id: 'p67', name: 'Vishnu Vinod', country: 'India', role: 'WK', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 31, setNo: 10, slabCategory: mapSlab(10), previousIPLTeams: 'RCB, DC, SRH, MI', rtms: 'MI', isOverseas: false, formerTeamId: 'mi' },
  { id: 'p68', name: 'Upendra Singh Yadav', country: 'India', role: 'WK', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 28, setNo: 10, slabCategory: mapSlab(10), previousIPLTeams: 'SRH', rtms: 'SRH', isOverseas: false, formerTeamId: 'srh' },

  { id: 'p69', name: 'Vaibhav Arora', country: 'India', role: 'BOWL', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 27, setNo: 11, slabCategory: mapSlab(11), previousIPLTeams: 'PBKS, KKR', rtms: 'KKR', isOverseas: false, formerTeamId: 'kkr' },
  { id: 'p70', name: 'Rasikh Dar', country: 'India', role: 'BOWL', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 25, setNo: 11, slabCategory: mapSlab(11), previousIPLTeams: 'MI, KKR, DC', rtms: 'DC', isOverseas: false, formerTeamId: 'dc' },
  { id: 'p71', name: 'Akash Madhwal', country: 'India', role: 'BOWL', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 31, setNo: 11, slabCategory: mapSlab(11), previousIPLTeams: 'MI', rtms: 'MI', isOverseas: false, formerTeamId: 'mi' },
  { id: 'p72', name: 'Mohit Sharma', country: 'India', role: 'BOWL', basePrice: 0.50, cappedUncapped: 'Uncapped', age: 36, setNo: 11, slabCategory: mapSlab(11), previousIPLTeams: 'CSK, PBKS, DC, GT', rtms: '', isOverseas: false },
  { id: 'p73', name: 'Simarjeet Singh', country: 'India', role: 'BOWL', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 27, setNo: 11, slabCategory: mapSlab(11), previousIPLTeams: 'CSK', rtms: 'CSK', isOverseas: false, formerTeamId: 'csk' },
  { id: 'p74', name: 'Yash Thakur', country: 'India', role: 'BOWL', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 26, setNo: 11, slabCategory: mapSlab(11), previousIPLTeams: 'LSG', rtms: 'LSG', isOverseas: false, formerTeamId: 'lsg' },
  { id: 'p75', name: 'Kartik Tyagi', country: 'India', role: 'BOWL', basePrice: 0.40, cappedUncapped: 'Uncapped', age: 24, setNo: 11, slabCategory: mapSlab(11), previousIPLTeams: 'RR, SRH, GT', rtms: 'GT', isOverseas: false, formerTeamId: 'gt' },
  { id: 'p76', name: 'Vyshak Vijaykumar', country: 'India', role: 'BOWL', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 28, setNo: 11, slabCategory: mapSlab(11), previousIPLTeams: 'RCB', rtms: 'RCB', isOverseas: false, formerTeamId: 'rcb' },

  { id: 'p77', name: 'Piyush Chawla', country: 'India', role: 'BOWL', basePrice: 0.50, cappedUncapped: 'Uncapped', age: 36, setNo: 12, slabCategory: mapSlab(12), previousIPLTeams: 'PBKS, KKR, CSK, MI', rtms: 'MI', isOverseas: false, formerTeamId: 'mi' },
  { id: 'p78', name: 'Shreyas Gopal', country: 'India', role: 'BOWL', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 31, setNo: 12, slabCategory: mapSlab(12), previousIPLTeams: 'RR, SRH, MI', rtms: 'MI', isOverseas: false, formerTeamId: 'mi' },
  { id: 'p79', name: 'Mayank Markande', country: 'India', role: 'BOWL', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 27, setNo: 12, slabCategory: mapSlab(12), previousIPLTeams: 'MI, RR, SRH', rtms: 'SRH', isOverseas: false, formerTeamId: 'srh' },
  { id: 'p80', name: 'Suyash Sharma', country: 'India', role: 'BOWL', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 21, setNo: 12, slabCategory: mapSlab(12), previousIPLTeams: 'KKR', rtms: 'KKR', isOverseas: false, formerTeamId: 'kkr' },
  { id: 'p81', name: 'Karn Sharma', country: 'India', role: 'BOWL', basePrice: 0.50, cappedUncapped: 'Uncapped', age: 37, setNo: 12, slabCategory: mapSlab(12), previousIPLTeams: 'SRH, MI, CSK, RCB', rtms: 'RCB', isOverseas: false, formerTeamId: 'rcb' },
  { id: 'p82', name: 'Kumar Kartikeya Singh', country: 'India', role: 'BOWL', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 27, setNo: 12, slabCategory: mapSlab(12), previousIPLTeams: 'MI', rtms: 'MI', isOverseas: false, formerTeamId: 'mi' },
  { id: 'p83', name: 'Manav Suthar', country: 'India', role: 'BOWL', basePrice: 0.30, cappedUncapped: 'Uncapped', age: 22, setNo: 12, slabCategory: mapSlab(12), previousIPLTeams: 'GT', rtms: '', isOverseas: false },

  { id: 'p84', name: 'Mayank Agarwal', country: 'India', role: 'BAT', basePrice: 1.0, cappedUncapped: 'Capped', age: 34, setNo: 13, slabCategory: mapSlab(13), previousIPLTeams: 'RCB, DC, RPS, PBKS, SRH', rtms: 'SRH', isOverseas: false, formerTeamId: 'srh' },
  { id: 'p85', name: 'Faf du Plessis', country: 'South Africa', role: 'BAT', basePrice: 2.0, cappedUncapped: 'Capped', age: 40, setNo: 13, slabCategory: mapSlab(13), previousIPLTeams: 'CSK, RCB', rtms: 'RCB', isOverseas: true, formerTeamId: 'rcb' },
  { id: 'p86', name: 'Glenn Phillips', country: 'New Zealand', role: 'BAT', basePrice: 2.0, cappedUncapped: 'Capped', age: 28, setNo: 13, slabCategory: mapSlab(13), previousIPLTeams: 'RR, SRH', rtms: 'SRH', isOverseas: true, formerTeamId: 'srh' },
  { id: 'p87', name: 'Rovman Powell', country: 'West Indies', role: 'BAT', basePrice: 1.5, cappedUncapped: 'Capped', age: 31, setNo: 13, slabCategory: mapSlab(13), previousIPLTeams: 'KKR, DC, RR', rtms: 'RR', isOverseas: true, formerTeamId: 'rr' },
  { id: 'p88', name: 'Ajinkya Rahane', country: 'India', role: 'BAT', basePrice: 1.5, cappedUncapped: 'Capped', age: 36, setNo: 13, slabCategory: mapSlab(13), previousIPLTeams: 'MI, RPS, RR, DC, KKR, SRH', rtms: 'CSK', isOverseas: false, formerTeamId: 'csk' },
  { id: 'p89', name: 'Prithvi Shaw', country: 'India', role: 'BAT', basePrice: 0.75, cappedUncapped: 'Capped', age: 25, setNo: 13, slabCategory: mapSlab(13), previousIPLTeams: 'DC', rtms: 'DC', isOverseas: false, formerTeamId: 'dc' },
  { id: 'p90', name: 'Kane Williamson', country: 'New Zealand', role: 'BAT', basePrice: 2.0, cappedUncapped: 'Capped', age: 34, setNo: 13, slabCategory: mapSlab(13), previousIPLTeams: 'SRH, GT', rtms: 'GT', isOverseas: true, formerTeamId: 'gt' },

  { id: 'p91', name: 'Sam Curran', country: 'England', role: 'AR', basePrice: 2.0, cappedUncapped: 'Capped', age: 26, setNo: 14, slabCategory: mapSlab(14), previousIPLTeams: 'CSK, PBKS', rtms: 'PBKS', isOverseas: true, formerTeamId: 'pbks' },
  { id: 'p92', name: 'Marco Jansen', country: 'South Africa', role: 'AR', basePrice: 1.25, cappedUncapped: 'Capped', age: 24, setNo: 14, slabCategory: mapSlab(14), previousIPLTeams: 'MI, SRH', rtms: 'SRH', isOverseas: true, formerTeamId: 'srh' },
  { id: 'p93', name: 'Daryl Mitchell', country: 'New Zealand', role: 'AR', basePrice: 2.0, cappedUncapped: 'Capped', age: 33, setNo: 14, slabCategory: mapSlab(14), previousIPLTeams: 'RR, CSK', rtms: 'CSK', isOverseas: true, formerTeamId: 'csk' },
  { id: 'p94', name: 'Krunal Pandya', country: 'India', role: 'AR', basePrice: 2.0, cappedUncapped: 'Capped', age: 34, setNo: 14, slabCategory: mapSlab(14), previousIPLTeams: 'MI, LSG', rtms: 'LSG', isOverseas: false, formerTeamId: 'lsg' },
  { id: 'p95', name: 'Nitish Rana', country: 'India', role: 'AR', basePrice: 1.5, cappedUncapped: 'Capped', age: 31, setNo: 14, slabCategory: mapSlab(14), previousIPLTeams: 'MI, KKR', rtms: 'KKR', isOverseas: false, formerTeamId: 'kkr' },
  { id: 'p96', name: 'Washington Sundar', country: 'India', role: 'AR', basePrice: 2.0, cappedUncapped: 'Capped', age: 25, setNo: 14, slabCategory: mapSlab(14), previousIPLTeams: 'RPS, RCB, SRH', rtms: 'SRH', isOverseas: false, formerTeamId: 'srh' },
  { id: 'p97', name: 'Shardul Thakur', country: 'India', role: 'AR', basePrice: 2.0, cappedUncapped: 'Capped', age: 33, setNo: 14, slabCategory: mapSlab(14), previousIPLTeams: 'PBKS, RPS, DC, KKR, CSK', rtms: 'CSK', isOverseas: false, formerTeamId: 'csk' },

  { id: 'p98', name: 'KS Bharat', country: 'India', role: 'WK', basePrice: 0.75, cappedUncapped: 'Capped', age: 31, setNo: 15, slabCategory: mapSlab(15), previousIPLTeams: 'RCB, DC, GT, KKR', rtms: '', isOverseas: false },
  { id: 'p99', name: 'Alex Carey', country: 'Australia', role: 'WK', basePrice: 1.0, cappedUncapped: 'Capped', age: 33, setNo: 15, slabCategory: mapSlab(15), previousIPLTeams: 'DC', rtms: '', isOverseas: true },
  { id: 'p100', name: 'Donovan Ferreira', country: 'South Africa', role: 'WK', basePrice: 0.75, cappedUncapped: 'Capped', age: 26, setNo: 15, slabCategory: mapSlab(15), previousIPLTeams: 'RR', rtms: 'RR', isOverseas: true, formerTeamId: 'rr' },
  { id: 'p101', name: 'Shai Hope', country: 'West Indies', role: 'WK', basePrice: 1.25, cappedUncapped: 'Capped', age: 31, setNo: 15, slabCategory: mapSlab(15), previousIPLTeams: 'DC', rtms: 'DC', isOverseas: true, formerTeamId: 'dc' },
  { id: 'p102', name: 'Josh Inglis', country: 'Australia', role: 'WK', basePrice: 2.0, cappedUncapped: 'Capped', age: 30, setNo: 15, slabCategory: mapSlab(15), previousIPLTeams: '', rtms: '', isOverseas: true },
  { id: 'p103', name: 'Ryan Rickelton', country: 'South Africa', role: 'WK', basePrice: 1.0, cappedUncapped: 'Capped', age: 28, setNo: 15, slabCategory: mapSlab(15), previousIPLTeams: '', rtms: '', isOverseas: true },

  { id: 'p104', name: 'Deepak Chahar', country: 'India', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 32, setNo: 16, slabCategory: mapSlab(16), previousIPLTeams: 'RPS, CSK', rtms: 'CSK', isOverseas: false, formerTeamId: 'csk' },
  { id: 'p105', name: 'Gerald Coetzee', country: 'South Africa', role: 'BOWL', basePrice: 1.25, cappedUncapped: 'Capped', age: 24, setNo: 16, slabCategory: mapSlab(16), previousIPLTeams: 'MI', rtms: 'MI', isOverseas: true, formerTeamId: 'mi' },
  { id: 'p106', name: 'Akash Deep', country: 'India', role: 'BOWL', basePrice: 1.0, cappedUncapped: 'Capped', age: 28, setNo: 16, slabCategory: mapSlab(16), previousIPLTeams: 'RCB', rtms: 'RCB', isOverseas: false, formerTeamId: 'rcb' },
  { id: 'p107', name: 'Tushar Deshpande', country: 'India', role: 'BOWL', basePrice: 1.0, cappedUncapped: 'Capped', age: 29, setNo: 16, slabCategory: mapSlab(16), previousIPLTeams: 'DC, CSK', rtms: 'CSK', isOverseas: false, formerTeamId: 'csk' },
  { id: 'p108', name: 'Lockie Ferguson', country: 'New Zealand', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 33, setNo: 16, slabCategory: mapSlab(16), previousIPLTeams: 'RPS, GT, KKR, RCB', rtms: 'RCB', isOverseas: true, formerTeamId: 'rcb' },
  { id: 'p109', name: 'Bhuvneshwar Kumar', country: 'India', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 35, setNo: 16, slabCategory: mapSlab(16), previousIPLTeams: 'PWI, SRH', rtms: 'SRH', isOverseas: false, formerTeamId: 'srh' },
  { id: 'p110', name: 'Mukesh Kumar', country: 'India', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 31, setNo: 16, slabCategory: mapSlab(16), previousIPLTeams: 'DC', rtms: 'DC', isOverseas: false, formerTeamId: 'dc' },

  { id: 'p111', name: 'Allah Ghazanfar', country: 'Afghanistan', role: 'BOWL', basePrice: 0.75, cappedUncapped: 'Capped', age: 19, setNo: 17, slabCategory: mapSlab(17), previousIPLTeams: 'KKR', rtms: 'KKR', isOverseas: true, formerTeamId: 'kkr' },
  { id: 'p112', name: 'Akeal Hosein', country: 'West Indies', role: 'BOWL', basePrice: 1.5, cappedUncapped: 'Capped', age: 31, setNo: 17, slabCategory: mapSlab(17), previousIPLTeams: 'SRH', rtms: '', isOverseas: true },
  { id: 'p113', name: 'Keshav Maharaj', country: 'South Africa', role: 'BOWL', basePrice: 0.75, cappedUncapped: 'Capped', age: 35, setNo: 17, slabCategory: mapSlab(17), previousIPLTeams: 'RR', rtms: 'RR', isOverseas: true, formerTeamId: 'rr' },
  { id: 'p114', name: 'Mujeeb Ur Rahman', country: 'Afghanistan', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 24, setNo: 17, slabCategory: mapSlab(17), previousIPLTeams: 'PBKS, SRH, KKR', rtms: '', isOverseas: true },
  { id: 'p115', name: 'Adil Rashid', country: 'England', role: 'BOWL', basePrice: 2.0, cappedUncapped: 'Capped', age: 37, setNo: 17, slabCategory: mapSlab(17), previousIPLTeams: 'PBKS, SRH', rtms: '', isOverseas: true },
  { id: 'p116', name: 'Vijayakanth Viyaskanth', country: 'Sri Lanka', role: 'BOWL', basePrice: 0.75, cappedUncapped: 'Capped', age: 23, setNo: 17, slabCategory: mapSlab(17), previousIPLTeams: 'SRH', rtms: 'SRH', isOverseas: true, formerTeamId: 'srh' },
];

export const TEAM_RETENTIONS: Record<string, {
  players: { name: string; role: Role; country: string; retainedPrice: number }[];
  cost: number;
  rtm: number;
}> = {
  csk: {
    players: [
      { name: 'Ruturaj Gaikwad', role: 'BAT', country: 'India', retainedPrice: 18 },
      { name: 'Ravindra Jadeja', role: 'AR', country: 'India', retainedPrice: 18 },
      { name: 'Shivam Dube', role: 'AR', country: 'India', retainedPrice: 13 },
      { name: 'Matheesha Pathirana', role: 'BOWL', country: 'Sri Lanka', retainedPrice: 12 },
      { name: 'MS Dhoni', role: 'WK', country: 'India', retainedPrice: 4 },
    ],
    cost: 65,
    rtm: 1,
  },

  mi: {
    players: [
      { name: 'Jasprit Bumrah', role: 'BOWL', country: 'India', retainedPrice: 18 },
      { name: 'Suryakumar Yadav', role: 'BAT', country: 'India', retainedPrice: 16.35 },
      { name: 'Hardik Pandya', role: 'AR', country: 'India', retainedPrice: 16.35 },
      { name: 'Rohit Sharma', role: 'BAT', country: 'India', retainedPrice: 16.30 },
      { name: 'Tilak Varma', role: 'BAT', country: 'India', retainedPrice: 8 },
    ],
    cost: 75,
    rtm: 1,
  },

  rcb: {
    players: [
      { name: 'Virat Kohli', role: 'BAT', country: 'India', retainedPrice: 21 },
      { name: 'Rajat Patidar', role: 'BAT', country: 'India', retainedPrice: 11 },
      { name: 'Yash Dayal', role: 'BOWL', country: 'India', retainedPrice: 5 },
    ],
    cost: 37,
    rtm: 3,
  },

  kkr: {
    players: [
      { name: 'Rinku Singh', role: 'BAT', country: 'India', retainedPrice: 13 },
      { name: 'Varun Chakaravarthy', role: 'BOWL', country: 'India', retainedPrice: 12 },
      { name: 'Sunil Narine', role: 'AR', country: 'Trinidad', retainedPrice: 12 },
      { name: 'Andre Russell', role: 'AR', country: 'Jamaica', retainedPrice: 12 },
      { name: 'Harshit Rana', role: 'BOWL', country: 'India', retainedPrice: 4 },
      { name: 'Ramandeep Singh', role: 'AR', country: 'India', retainedPrice: 4 },
    ],
    cost: 57,
    rtm: 0,
  },

  rr: {
    players: [
      { name: 'Sanju Samson', role: 'WK', country: 'India', retainedPrice: 18 },
      { name: 'Yashasvi Jaiswal', role: 'BAT', country: 'India', retainedPrice: 18 },
      { name: 'Riyan Parag', role: 'AR', country: 'India', retainedPrice: 14 },
      { name: 'Dhruv Jurel', role: 'WK', country: 'India', retainedPrice: 14 },
      { name: 'Shimron Hetmyer', role: 'BAT', country: 'Guyana', retainedPrice: 11 },
      { name: 'Sandeep Sharma', role: 'BOWL', country: 'India', retainedPrice: 4 },
    ],
    cost: 79,
    rtm: 0,
  },

  srh: {
    players: [
      { name: 'Pat Cummins', role: 'BOWL', country: 'Australia', retainedPrice: 18 },
      { name: 'Abhishek Sharma', role: 'AR', country: 'India', retainedPrice: 14 },
      { name: 'Nitish Kumar Reddy', role: 'AR', country: 'India', retainedPrice: 6 },
      { name: 'Heinrich Klaasen', role: 'WK', country: 'South Africa', retainedPrice: 23 },
      { name: 'Travis Head', role: 'BAT', country: 'Australia', retainedPrice: 14 },
    ],
    cost: 75,
    rtm: 1,
  },

  dc: {
    players: [
      { name: 'Axar Patel', role: 'AR', country: 'India', retainedPrice: 16.50 },
      { name: 'Kuldeep Yadav', role: 'BOWL', country: 'India', retainedPrice: 13.25 },
      { name: 'Tristan Stubbs', role: 'BAT', country: 'South Africa', retainedPrice: 10 },
      { name: 'Abhishek Porel', role: 'WK', country: 'India', retainedPrice: 4 },
    ],
    cost: 43.75,
    rtm: 2,
  },

  pbks: {
    players: [
      { name: 'Shashank Singh', role: 'BAT', country: 'India', retainedPrice: 5.5 },
      { name: 'Prabhsimran Singh', role: 'WK', country: 'India', retainedPrice: 4 },
    ],
    cost: 9.5,
    rtm: 4,
  },

  gt: {
    players: [
      { name: 'Rashid Khan', role: 'AR', country: 'Afghanistan', retainedPrice: 18 },
      { name: 'Shubman Gill', role: 'BAT', country: 'India', retainedPrice: 16.50},
      { name: 'Sai Sudharsan', role: 'BAT', country: 'India', retainedPrice: 8.50 },
      { name: 'Rahul Tewatia', role: 'AR', country: 'India', retainedPrice: 4 },
      { name: 'Shahrukh Khan', role: 'BAT', country: 'India', retainedPrice: 4 },
    ],
    cost: 51,
    rtm: 1,
  },

  lsg: {
    players: [
      { name: 'Nicholas Pooran', role: 'WK', country: 'Trinidad', retainedPrice: 21 },
      { name: 'Ravi Bishnoi', role: 'BOWL', country: 'India', retainedPrice: 11 },
      { name: 'Mayank Yadav', role: 'BOWL', country: 'India', retainedPrice: 11 },
      { name: 'Mohsin Khan', role: 'BOWL', country: 'India', retainedPrice: 4 },
      { name: 'Ayush Badoni', role: 'AR', country: 'India', retainedPrice: 4 },
    ],
    cost: 51,
    rtm: 1,
  },
};
