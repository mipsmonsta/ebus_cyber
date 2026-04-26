// @ts-ignore - CSV raw imports are handled by Vite
import adE200 from '../../public/data/Alexander_Dennis_Enviro200EV.csv?raw';
// @ts-ignore
import bydK9 from '../../public/data/BYD_K9.csv?raw';
// @ts-ignore
import manLC from '../../public/data/MAN_Lions_City.csv?raw';
// @ts-ignore
import mbEC from '../../public/data/Mercedes_Benz_eCitaro.csv?raw';
// @ts-ignore
import proterra from '../../public/data/Proterra_ZX5.csv?raw';
// @ts-ignore
import solaris from '../../public/data/Solaris_Urbino_12_Electric.csv?raw';
// @ts-ignore
import volvo from '../../public/data/Volvo_7900.csv?raw';
// @ts-ignore
import yutong from '../../public/data/Yutong_E12.csv?raw';

export const EMBEDDED_DATA = [
  { fileName: 'Alexander_Dennis_Enviro200EV.csv', content: adE200 },
  { fileName: 'BYD_K9.csv', content: bydK9 },
  { fileName: 'MAN_Lions_City.csv', content: manLC },
  { fileName: 'Mercedes_Benz_eCitaro.csv', content: mbEC },
  { fileName: 'Proterra_ZX5.csv', content: proterra },
  { fileName: 'Solaris_Urbino_12_Electric.csv', content: solaris },
  { fileName: 'Volvo_7900.csv', content: volvo },
  { fileName: 'Yutong_E12.csv', content: yutong },
];
