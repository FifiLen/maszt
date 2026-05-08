"use client";

import React from "react";
import Link from "next/link";
import { FormattedText } from "./formatted-text"; // Importujemy Twój komponent animujący

// --- DANE ---
const teamMembers = [
  {
    name: "Alicja Sobik – Lipus",
    role: "Członkini Zarządu",
    description: "**psycholożka**, **psychoterapeuta**, była zaangażowana w działania związku zawodowego",
    image: "https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69fcba460032f3d10c91/view?project=69b30650001b6b60508c&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjlmY2JhNGUyNDk4YzZjZGVlNzQiLCJyZXNvdXJjZUlkIjoiNjljMDMzNTEwMDE2M2UyOWRiNTQ6NjlmY2JhNDYwMDMyZjNkMTBjOTEiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY2MzEyOjI1IiwiaWF0IjoxNzc4MTcwNDQ2fQ.R9fc4WzzOZXpRGMlwJ6NYg23K5ZuCbaxGBNV0bjoWEI",
  },
  {
    name: "Michał Naczyński",
    role: "Członek Zarządu",
    description: "**psycholog**, **psychoterapeuta**, **koordynator projektów** przy Stowarzyszeniu Oświatowym Rodzice-Dzieciom w Rybniku. Członek Zarządu Krajowego Ogólnopolskiego Związku Zawodowego Psychologów (2021-25)",
    image: "https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69fcba970013c62dc3fc/view?project=69b30650001b6b60508c&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjlmY2JhOWQyYmI1MGM2Mjk0YmYiLCJyZXNvdXJjZUlkIjoiNjljMDMzNTEwMDE2M2UyOWRiNTQ6NjlmY2JhOTcwMDEzYzYyZGMzZmMiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY2MzEyOjI2IiwiaWF0IjoxNzc4MTcwNTI1fQ.xe6EL4kVuiYatc0Gbww_pDnnx9YwVbFVmEwFE6XVrvs",
  },
  {
    name: "Magdalena Kufka",
    role: "Członkini Zarządu",
    description: "**psycholożka**, **psychoterapeuta** prowadziła projekty w Stowarzyszeniu Pod Wieżą przy rybnickim szpitalu psychiatrycznym",
    image: "https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69fcbac800060b948646/view?project=69b30650001b6b60508c&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjlmY2JhY2RjZDdmNTM1YWU3ZjgiLCJyZXNvdXJjZUlkIjoiNjljMDMzNTEwMDE2M2UyOWRiNTQ6NjlmY2JhYzgwMDA2MGI5NDg2NDYiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY2MzEyOjI3IiwiaWF0IjoxNzc4MTcwNTczfQ.bnXzEZrBAKM878qqef1kbCQlNm8WtyHpNmM6rdWoC0I",
  },
];

const documents = [
  { 
    title: "Statut Fundacji Maszt", 
    url: "https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69c31c1100299ec86a35/view?project=69b30650001b6b60508c&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjljMzFjMTYwOTIyOGE1ZWJkODgiLCJyZXNvdXJjZUlkIjoiNjljMDMzNTEwMDE2M2UyOWRiNTQ6NjljMzFjMTEwMDI5OWVjODZhMzUiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY2MzEyOjE3IiwiaWF0IjoxNzc0Mzk0MzkwfQ.PeX93qlsB9VMwcjm2KumuYeLipUFKv4vN0DODTwEtV4" 
  },
  { 
    title: "Regulamin obiegu dokumentów finansowych", 
    url: "https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69c31d85000edc341f89/view?project=69b30650001b6b60508c&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjljMzFkOGI3Mjk3YzYxZmQxZTYiLCJyZXNvdXJjZUlkIjoiNjljMDMzNTEwMDE2M2UyOWRiNTQ6NjljMzFkODUwMDBlZGMzNDFmODkiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY2MzEyOjIwIiwiaWF0IjoxNzc0Mzk0NzYzfQ.xLBixvWzY_ngwu8YLqsH3V9Orpsnu18mRHsZjm2bFTc" 
  },
  { 
    title: "Polityka ochrony dzieci", 
    url: "https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69c31e0c002d99c72101/view?project=69b30650001b6b60508c&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjljMzFlMTM3Y2RkMzYxOTVmMmYiLCJyZXNvdXJjZUlkIjoiNjljMDMzNTEwMDE2M2UyOWRiNTQ6NjljMzFlMGMwMDJkOTljNzIxMDEiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY2MzEyOjIyIiwiaWF0IjoxNzc0Mzk0ODk5fQ.CEL1wtZ6xVTZJLNduvv9sJbJhZN7bpYOi6Hp1oHAegA" 
  },
  { 
    title: "RODO", 
    url: "https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69c31c670013f56a48be/view?project=69b30650001b6b60508c&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjljMzFjNmJiYWJmNWIxZDE3NWQiLCJyZXNvdXJjZUlkIjoiNjljMDMzNTEwMDE2M2UyOWRiNTQ6NjljMzFjNjcwMDEzZjU2YTQ4YmUiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY2MzEyOjE4IiwiaWF0IjoxNzc0Mzk0NDc1fQ.G7D06dfwId3SahhySu2ZR6vn5jFAAF9PrajyIQH0fOs" 
  },
  { 
    title: "Polityka ochrony – wersja graficzna", 
    url: "https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69c31dc8000007d21afa/view?project=69b30650001b6b60508c&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjljMzFkY2NlYTZjY2QyZTY4ODUiLCJyZXNvdXJjZUlkIjoiNjljMDMzNTEwMDE2M2UyOWRiNTQ6NjljMzFkYzgwMDAwMDdkMjFhZmEiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY2MzEyOjIxIiwiaWF0IjoxNzc0Mzk0ODI4fQ.Y5llNG_yaRa-Jhi_rWJFK76MkC3tN1tQWSpc_FRYbks" 
  },
  { 
    title: "Rozliczenie finansowe 2024", 
    url: "https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69c31e3d0019550634ef/view?project=69b30650001b6b60508c&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjljMzFlNDIwZDFjZTQxYjg3NDAiLCJyZXNvdXJjZUlkIjoiNjljMDMzNTEwMDE2M2UyOWRiNTQ6NjljMzFlM2QwMDE5NTUwNjM0ZWYiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY2MzEyOjIzIiwiaWF0IjoxNzc0Mzk0OTQ2fQ.5KJbvpuKw1AgmDzBkjYkobPU-yyrE5N_rEZf03SZVGY" 
  },
  { 
    title: "Sprawozdanie z działalności 2024", 
    url: "https://fra.cloud.appwrite.io/v1/storage/buckets/69c0335100163e29db54/files/69c31d36002ab0c39092/view?project=69b30650001b6b60508c&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjljMzFkM2MzNzEwNmUyZGIyMjciLCJyZXNvdXJjZUlkIjoiNjljMDMzNTEwMDE2M2UyOWRiNTQ6NjljMzFkMzYwMDJhYjBjMzkwOTIiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjY2MzEyOjE5IiwiaWF0IjoxNzc0Mzk0Njg0fQ.AQ8OBjBpsP8lYhESx7ir7xWFsNgJss-aK968HpEsJEg" 
  },
];

export default function AboutSection() {
  return (
    <section className="w-full flex flex-col bg-[#e8e4df] text-[#3ead8f]">
      
      {/* 1 & 2. O FUNDACJI + LUDZIE MASZTU */}
      <div className="w-full px-6 lg:px-10 py-16 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 relative">
          
          {/* LEWA STRONA - Pływający nagłówek */}
          <div className="md:col-span-5 md:col-start-2 md:text-right h-full">
            <div className="sticky top-32">
              <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-medium leading-none tracking-tighter">
                O fundacji
              </h1>
            </div>
          </div>
          
          {/* PRAWA STRONA - Scrollujący kontent */}
          <div className="md:col-span-5 md:col-start-8 flex flex-col gap-24 mt-6 md:mt-0">
            
            {/* Paragrafy opisowe z FormattedText */}
            <div className="flex flex-col gap-6">
              <p className="font-sans text-sm md:text-base lg:text-lg leading-relaxed opacity-90">
                <FormattedText text="Fundacja Maszt została powołana przez Centrum Psychoterapii i Psychiatrii **CognitivaMed**. Świadczenie **pomocy psychologicznej** w chwilach **kryzysu** lub choroby uświadamia, jak bardzo ludzie – dzieci, młodzież, dorośli – cierpią z poczucia bycia **niewystarczającymi**." />
              </p>
              <p className="font-sans text-sm md:text-base lg:text-lg leading-relaxed opacity-90">
                <FormattedText text="**Samostanowienie**, **sprawczość** i **wspólnota** pozwalają doświadczać bycia wartościowym człowiekiem! Chcemy, aby w naszej lokalnej społeczności ludzie mogli odkrywać w sobie te aspekty. Dlatego my budujemy **infrastrukturę społeczną**, by ludzie doświadczali **bycia wartością**." />
              </p>
              <p className="font-sans text-sm md:text-base lg:text-lg leading-relaxed opacity-90">
                <FormattedText text="Fundacja powstała w **Rybniku**, a jej siedziba mieści się w dzielnicy Orzepowice. Na północ znajduje się **Zalew Rybnicki**, na którym nadal można zobaczyć łódki z **masztami** i wiatrem dmuchającym w żagle. Zalew powstał sztucznie na potrzeby **Elektrowni Rybnik**, od której maszty wysokiego napięcia przesyłają ogrom energii mieszkańcom miasta i okolic." />
              </p>
            </div>

            {/* Lista ludzi MASZTu */}
            <div className="flex flex-col gap-12">
              <h2 className="font-heading text-4xl md:text-5xl font-medium leading-none tracking-tighter border-b border-[#3ead8f]/30 pb-6 mb-2">
                Ludzie MASZTu
              </h2>
              
              <div className="flex flex-col gap-10">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    {member.image && (
                      <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-[#3ead8f]/10 mt-1">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <h3 className="font-heading text-3xl lg:text-4xl uppercase tracking-tighter leading-none mb-3">
                        {member.name}
                      </h3>
                      <span className="font-mono text-xs uppercase tracking-wider block opacity-60 mb-4">
                        {member.role}
                      </span>
                      <p className="font-sans text-sm md:text-base leading-relaxed opacity-90">
                        {/* Tutaj też FormattedText dla opisów członków zespołu */}
                        <FormattedText text={member.description} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. DOKUMENTY */}
      <div className="w-full bg-[#3ead8f] text-[#e8e4df] px-6 lg:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 relative">
          
          <div className="md:col-span-5 md:col-start-2 md:text-right">
            <h2 className="font-heading text-6xl md:text-7xl lg:text-8xl font-medium leading-none tracking-tighter">
              Dokumenty
            </h2>
          </div>

          <div className="md:col-span-5 md:col-start-8 flex flex-wrap gap-3 content-start mt-6 md:mt-0">
            {documents.map((doc, index) => (
              <Link 
                key={index} 
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-5 py-2.5 border border-[#e8e4df]/30 rounded-full hover:bg-[#e8e4df] transition-colors duration-300"
              >
                <span className="font-sans text-sm md:text-base group-hover:text-[#3ead8f] transition-colors whitespace-nowrap">
                  {doc.title}
                </span>
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-wider bg-[#e8e4df]/20 group-hover:bg-[#3ead8f]/10 group-hover:text-[#3ead8f] px-2 py-0.5 rounded-full transition-colors">
                  PDF
                </span>
              </Link>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}