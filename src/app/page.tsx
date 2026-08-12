// import Navbar from "@/Components/Navbar";
// import Image from "next/image";

import Budgetpickssection from "@/Components/Budgetpickssection";
import Hero from "@/Components/Hero";
import Mudibazar from "@/Components/Mudibazar";
import Newarrivalssection from "@/Components/Newarrivalssection";
import Topsellingsection from "@/Components/Topsellingsection";

// import ProductsPage from "@/Components/products";

export default function Home() {
  return (
    <>
      <Hero/>
      <Budgetpickssection />
      <Mudibazar />
      <Topsellingsection />
      <Newarrivalssection />
    </>
  );
}
