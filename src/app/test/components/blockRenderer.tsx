"use client";

import React from 'react';
import ImageGalleryBlock from './image-gallery-clock';
import InteractiveTableBlock from './interactive-table-block';
import InteractiveFeaturesBlock from './interactive-features-block';
import ImagePortalBlock from './image-portal-block';
import ImageSplitBlock from './image-split-block';
import TeamBlock from './team-block';
import { FormattedText } from './formatted-text';

// --- SYSTEM LAYOUTOWY ---

function HeroBlock({ data }: { data: any }) {
  return (
    <div className="pt-12 pb-16 lg:pt-12 lg:pb-12 text-[#3ead8f] w-full flex justify-center">
      <div className="w-full max-w-4xl px-6 flex flex-col items-center text-center gap-6">
        <h2 className="font-heading text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-tighter">
          <FormattedText text={data.subtitle} />
        </h2>
        {data.introText && (
          <p className="font-sans text-xl md:text-2xl leading-relaxed opacity-90 max-w-2xl mt-4">
            <FormattedText text={data.introText} />
          </p>
        )}
      </div>
    </div>
  );
}

function FundingBannerBlock({ data }: { data: any }) {
  const images = data.images || (data.image ? [data.image] : []);
  
  if (!data.content && images.length === 0) return null;

  return (
    <section className="py-12 bg-white border-y border-[#3ead8f]/10 w-full flex justify-center">
      <div className="w-full max-w-5xl px-6 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
        
        {images.length > 0 && (
          <ul className="flex flex-wrap items-center justify-center gap-6 md:gap-8 list-none p-0 m-0">
            {images.map((img: any, index: number) => (
              <li key={index} className="flex items-center">
                <img 
                  src={img.url} 
                  alt={img.alt || ""} 
                  className="h-10 md:h-14 w-auto object-contain"
                />
              </li>
            ))}
          </ul>
        )}

        {images.length > 0 && data.content && (
          <div className="hidden md:block w-px h-12 bg-[#3ead8f]/20" aria-hidden="true" />
        )}

        {data.content && (
          <div className="max-w-md text-center md:text-left">
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-wider leading-relaxed text-[#3ead8f] opacity-80">
              <FormattedText text={data.content} />
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function FundingBlock({ data }: { data: any }) {
  if (!data.content) return null;
  return (
    <div className="py-8 text-[#3ead8f] w-full bg-[#3ead8f]/5 flex justify-center">
      <div className="w-full max-w-3xl px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-wider leading-relaxed opacity-60">
          <FormattedText text={data.content} />
        </p>
      </div>
    </div>
  );
}

function TextBlock({ data }: { data: any }) {
  return (
    <div className="py-16 lg:py-20 text-[#3ead8f] w-full flex justify-center">
      <div className="w-full max-w-3xl px-6 flex flex-col items-center text-center gap-6">
        {data.heading && (
          <h3 className="font-heading text-4xl md:text-5xl uppercase leading-[1] tracking-tighter mb-2">
            <FormattedText text={data.heading} />
          </h3>
        )}
        <p className="font-sans text-base md:text-lg lg:text-xl leading-relaxed opacity-90">
          <FormattedText text={data.content} />
        </p>
      </div>
    </div>
  );
}

function DownloadsBlock({ data }: { data: any }) {
  if (!data.files || data.files.length === 0) return null;
  return (
    <div className="py-16 lg:py-20 text-[#3ead8f] w-full flex justify-center">
      <div className="w-full max-w-3xl px-6 flex flex-col gap-8 md:gap-12">
        {data.heading && (
          <h3 className="font-heading text-4xl md:text-5xl uppercase leading-none tracking-tighter text-center">
            <FormattedText text={data.heading} />
          </h3>
        )}
        <div className="w-full flex flex-col border-t border-[#3ead8f]">
          {data.files.map((file: any, i: number) => (
            <a 
              key={i} 
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-[#3ead8f] hover:bg-[#3ead8f] transition-colors duration-300"
            >
              <div className="flex flex-col gap-1">
                <span className="font-sans text-lg md:text-xl group-hover:text-[#e8e4df] transition-colors">
                  <FormattedText text={file.fileName || file.title} />
                </span>
                {(file.fileFormat || file.fileSize) && (
                  <span className="font-mono text-[10px] md:text-xs uppercase tracking-wider opacity-60 group-hover:text-[#e8e4df]/70 transition-colors">
                    {[file.fileFormat, file.fileSize].filter(Boolean).join(' • ')}
                  </span>
                )}
              </div>
              <span className="mt-4 md:mt-0 font-mono text-xs uppercase tracking-wider px-4 py-2 border border-[#3ead8f] group-hover:border-[#e8e4df] group-hover:text-[#e8e4df] rounded-full transition-colors whitespace-nowrap text-center">
                Pobierz
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function FancyDownloadsBlock({ data }: { data: any }) {
  if (!data.files || data.files.length === 0) return null;
  return (
    <div className="py-16 lg:py-20 text-[#3ead8f] w-full flex justify-center">
      <div className="w-full max-w-3xl px-6 flex flex-col gap-8 md:gap-12">
        <div className="flex flex-col items-center text-center gap-4">
          {data.heading && (
            <h3 className="font-heading text-4xl md:text-5xl uppercase leading-none tracking-tighter">
              <FormattedText text={data.heading} />
            </h3>
          )}
          {data.intro && (
            <p className="font-sans text-base md:text-lg opacity-80 max-w-2xl">
              <FormattedText text={data.intro} />
            </p>
          )}
        </div>
        <div className="w-full flex flex-col border-t border-[#3ead8f]">
          {data.files.map((file: any, i: number) => {
            const isPlaceholder = file.url === "#";
            return (
              <a 
                key={i} 
                href={isPlaceholder ? undefined : file.url}
                target={isPlaceholder ? undefined : "_blank"}
                rel="noreferrer"
                className={`group flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-[#3ead8f] transition-colors duration-300 ${isPlaceholder ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-[#3ead8f]'}`}
              >
                <div className="flex flex-col gap-1">
                  <span className={`font-sans text-lg md:text-xl transition-colors ${!isPlaceholder && 'group-hover:text-[#e8e4df]'}`}>
                    <FormattedText text={file.title || file.fileName} />
                  </span>
                  {file.format && (
                    <span className={`font-mono text-[10px] md:text-xs uppercase tracking-wider opacity-60 transition-colors ${!isPlaceholder && 'group-hover:text-[#e8e4df]/70'}`}>
                      {file.format}
                    </span>
                  )}
                </div>
                <span className={`mt-4 md:mt-0 font-mono text-xs uppercase tracking-wider px-4 py-2 border border-[#3ead8f] rounded-full transition-colors whitespace-nowrap text-center ${!isPlaceholder && 'group-hover:border-[#e8e4df] group-hover:text-[#e8e4df]'}`}>
                  {isPlaceholder ? 'Brak linku' : 'Pobierz'}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CtaListBlock({ data }: { data: any }) {
  return (
    <div className="py-16 w-full flex justify-center">
      <div className="w-full max-w-4xl bg-[#3ead8f]/5 rounded-3xl p-8 md:p-14 text-[#3ead8f] flex flex-col items-center text-center gap-10">
        <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase leading-[1] tracking-tighter">
          <FormattedText text={data.heading} />
        </h3>
        {data.intro && (
          <p className="font-sans text-base md:text-lg lg:text-xl leading-relaxed opacity-90 max-w-2xl">
            <FormattedText text={data.intro} />
          </p>
        )}
        
        <div className="w-full max-w-2xl text-left mt-6">
          {data.listHeading && (
            <h4 className="font-mono text-xs uppercase tracking-wider opacity-60 border-b border-[#3ead8f]/20 pb-4 mb-6 text-center">
              <FormattedText text={data.listHeading} />
            </h4>
          )}
          <ul className="flex flex-col gap-5 list-none">
            {data.items.map((item: string, i: number) => (
              <li key={i} className="flex gap-4 items-start bg-white/50 p-4 rounded-xl border border-[#3ead8f]/10">
                <span className="font-mono text-xs uppercase tracking-wider bg-[#3ead8f]/10 px-2 py-1 rounded-full shrink-0">
                  {(i+1).toString().padStart(2, '0')}
                </span>
                <span className="font-sans text-base leading-relaxed opacity-90 mt-0.5">
                  <FormattedText text={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function BenefitsBlock({ data }: { data: any }) {
  return (
    <div className="py-16 text-[#3ead8f] w-full flex justify-center">
      <div className="w-full max-w-3xl px-6 flex flex-col items-center text-center gap-8">
        <h3 className="font-heading text-3xl md:text-4xl uppercase leading-[1] tracking-tighter">
          <FormattedText text={data.heading} />
        </h3>
        <ul className="flex flex-col gap-4 w-full text-left">
          {data.items.map((item: string, i: number) => (
            <li key={i} className="flex gap-4 items-center bg-[#3ead8f]/5 p-4 rounded-xl">
              <span className="text-[#3ead8f] opacity-60 text-xl">▹</span>
              <span className="font-sans text-base leading-relaxed opacity-90">
                <FormattedText text={item} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RecruitmentHubBlock({ data }: { data: any }) {
  const isSingleCta = data.callsToAction && data.callsToAction.length === 1;

  return (
    <div className="py-16 text-[#3ead8f] w-full flex justify-center">
      <div className="w-full max-w-4xl px-6 flex flex-col items-center text-center gap-10">
        <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase leading-[1] tracking-tighter">
          <FormattedText text={data.heading} />
        </h3>
        {data.text && (
          <p className="font-sans text-base md:text-lg lg:text-xl leading-relaxed opacity-90 max-w-2xl">
            <FormattedText text={data.text} />
          </p>
        )}
        <div className={`w-full mt-6 ${isSingleCta ? 'flex justify-center' : 'grid grid-cols-1 sm:grid-cols-2 gap-6'}`}>
          {data.callsToAction.map((cta: any, i: number) => (
            <div key={i} className={`flex flex-col items-center text-center gap-4 bg-[#3ead8f]/5 p-8 rounded-2xl border border-[#3ead8f]/10 ${isSingleCta ? 'w-full max-w-2xl' : 'w-full'}`}>
              <h4 className="font-heading text-2xl md:text-3xl uppercase leading-[1] tracking-tighter">
                <FormattedText text={cta.title} />
              </h4>
              <p className="font-sans text-sm md:text-base leading-relaxed opacity-80">
                <FormattedText text={cta.description} />
              </p>
              <a href={cta.linkUrl} className="mt-auto font-mono text-xs uppercase font-medium tracking-wider bg-[#3ead8f] text-[#e8e4df] px-6 py-2.5 rounded-full hover:bg-opacity-80 transition-colors">
                 <FormattedText text={cta.linkText} /> ↗
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SponsorsBlock({ data }: { data: any }) {
  const logos = data.logos || [];
  if (logos.length === 0) return null;

  return (
    <div className="py-16 text-[#3ead8f] w-full flex justify-center border-t border-[#3ead8f]/10">
      <div className="w-full max-w-4xl px-6 flex flex-col items-center text-center gap-8">
        <div>
          <h3 className="font-heading text-3xl md:text-4xl uppercase leading-[1] tracking-tighter">
            <FormattedText text={data.heading || "Sponsorzy i Partnerzy"} />
          </h3>
          {data.subtext && (
             <p className="font-sans text-sm opacity-70 mt-3">
               <FormattedText text={data.subtext} />
             </p>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-4">
          {logos.map((logo: any, i: number) => {
             const isClickable = !!logo.linkUrl && logo.linkUrl !== "#";
             const imageUrl = logo.url && logo.url !== "#" ? logo.url : null;
             
             return (
               <a 
                 key={i} 
                 href={isClickable ? logo.linkUrl : undefined} 
                 target={isClickable ? "_blank" : undefined} 
                 rel={isClickable ? "noreferrer" : undefined}
                 className={`block relative w-32 h-16 md:w-40 md:h-20 ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'} opacity-60 hover:opacity-100 transition-all duration-300 bg-[#3ead8f]/5 rounded-lg flex items-center justify-center overflow-hidden p-2`}
               >
                 {imageUrl ? (
                   <img 
                    src={imageUrl} 
                    alt={logo.alt || "Logo sponsora"} 
                    className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-500"
                   />
                 ) : (
                    <span className="font-mono text-[10px] text-[#3ead8f] uppercase text-center px-2 opacity-50">
                      {logo.alt || `Sponsor ${i+1}`}
                    </span>
                 )}
               </a>
             );
          })}
        </div>
      </div>
    </div>
  );
}

function FullImageBlock({ data }: { data: any }) {
  if (!data.image?.url) return null;
  return (
    <div className="w-full py-10 flex justify-center">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl h-[40vh] md:h-[60vh] relative bg-[#3ead8f]/5">
        <img 
          src={data.image.url} 
          alt={data.image.alt || "Zdjęcie projektu"} 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

function TextImageBlock({ data }: { data: any }) {
  return (
    <div className="py-16 text-[#3ead8f] w-full flex justify-center">
      <div className="w-full max-w-4xl px-6 flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div className="w-full md:w-1/2 flex flex-col text-center md:text-left gap-4">
          {data.heading && (
            <h3 className="font-heading text-4xl uppercase leading-[1] tracking-tighter">
              <FormattedText text={data.heading} />
            </h3>
          )}
          <p className="font-sans text-base md:text-lg leading-relaxed opacity-90">
            <FormattedText text={data.content} />
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <div className="w-full aspect-square md:aspect-[4/5] bg-[#3ead8f]/10 rounded-3xl overflow-hidden relative">
            {data.image?.url && (
              <img 
                src={data.image.url} 
                alt={data.image.alt || ""} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsBlock({ data }: { data: any }) {
  return (
    <div className="py-16 text-[#3ead8f] w-full flex justify-center">
      <div className="w-full max-w-4xl px-6 flex flex-col md:flex-row gap-10 md:gap-16 justify-center text-center">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-wider opacity-60">
            Czas trwania
          </span>
          <span className="font-heading text-5xl md:text-6xl lg:text-7xl uppercase leading-none tracking-tighter">
            <FormattedText text={data.timeline} />
          </span>
        </div>
        <div className="hidden md:block w-px bg-[#3ead8f]/20"></div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-wider opacity-60">
            Odbiorcy
          </span>
          <span className="font-heading text-5xl md:text-6xl lg:text-7xl uppercase leading-none tracking-tighter">
            <FormattedText text={data.targetGroupSize} />
          </span>
        </div>
      </div>
    </div>
  );
}

// --- GŁÓWNY MAPER ---
const componentMap: Record<string, React.ComponentType<any>> = {
  'section.hero': HeroBlock,
  'section.features': InteractiveFeaturesBlock,
  'section.text-block': TextBlock,
  'section.call-to-action-list': CtaListBlock,
  'section.benefits': BenefitsBlock,
  'section.image-gallery': ImageGalleryBlock,
  'section.image-portal': ImagePortalBlock,
  'section.image-split': ImageSplitBlock,
  'section.contact-footer': () => null,
  'section.funding-info': FundingBlock,
  'section.funding-banner': FundingBannerBlock, // <-- NOWOŚĆ
  'section.downloads': DownloadsBlock,
  'section.project-footer': FundingBlock,
  'section.stats-highlight': StatsBlock,
  'section.actions-table': InteractiveTableBlock,
  'section.recruitment-hub': RecruitmentHubBlock,
  'section.team': TeamBlock,
  'section.downloads-fancy': FancyDownloadsBlock,
  'section.full-image': FullImageBlock,
  'section.text-image': TextImageBlock,
  'section.staggered-images': FullImageBlock,
  'section.sponsors': SponsorsBlock,
};

export default function BlockRenderer({ block, index }: { block: any, index: number }) {
  const Component = componentMap[block.__component];

  if (!Component) {
    console.warn(`Nieznany blok: ${block.__component}`);
    return null;
  }

  return <Component key={index} data={block} index={index} />;
}