// Hero + SecTiles + DestaqueGrid + NovidadesGrid + ConfiancaColunas
import { Hero } from '../components/home/Hero';
import { SecTiles } from '../components/home/SecTiles';
import { DestaqueGrid } from '../components/home/DestaqueGrid';
import { NovidadesGrid } from '../components/home/NovidadesGrid';
import { ConfiancaColunas } from '../components/home/ConfiancaColunas';

export function HomePage() {
  return (
    <div>
      <Hero />
      <SecTiles />
      <DestaqueGrid />
      <NovidadesGrid />
      <ConfiancaColunas />
    </div>
  );
}
