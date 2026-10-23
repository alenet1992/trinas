// Conteúdo do site público (rota "/").
// Os textos aceitam **negrito**; uma linha em branco separa parágrafos e uma
// quebra de linha simples força uma mudança de linha.

export interface SiteContentData {
  header: {
    logo: string;
    menuProducts: string;
    menuAbout: string;
    menuContacts: string;
    menuLogin: string;
  };
  hero: {
    sideLabel: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    text: string;
    buttonLabel: string;
    backgroundImage: string;
    image: string;
  };
  selection: {
    scriptText: string;
    title: string;
    text: string;
    sideLabel: string;
    circleText: string;
    decorationImage: string;
    image1: string;
    image2: string;
    image3: string;
    image4: string;
  };
  about: {
    titleLine1: string;
    titleLine2: string;
    text: string;
    bigWord: string;
    sideLabel: string;
    circleText: string;
    image: string;
  };
  local: {
    titleLine1: string;
    titleLine2: string;
    heading: string;
    text: string;
    bigWord: string;
    sideLabel: string;
    circleText: string;
    image: string;
  };
  team: {
    titleLine1: string;
    titleLine2: string;
    heading: string;
    text: string;
    bigWord: string;
    sideLabel: string;
    image: string;
  };
  map: {
    embedUrl: string;
  };
  contacts: {
    title: string;
    address: string;
    phone: string;
    email: string;
    facebookLabel: string;
    facebookUrl: string;
    copyright: string;
    credit: string;
    creditUrl: string;
  };
}

export type SiteSectionKey = keyof SiteContentData;

export const siteContentDefaults: SiteContentData = {
  header: {
    logo: "/site/logo.png",
    menuProducts: "Os Nossos Produtos",
    menuAbout: "Sobre Nós",
    menuContacts: "Contactos",
    menuLogin: "Login",
  },
  hero: {
    sideLabel: "Bem-vindo às Trinas",
    titleLine1: "Padaria",
    titleLine2: "Trinas",
    subtitle: "Tradição de Padaria desde 1881",
    text: "Aberta em Guimarães desde 1881, o peso da instituição vê-se na forma como os nossos bolos tradicionais contam uma história. Cada receita, transmitida de geração em geração, é um pedaço do nosso passado. A nossa tradição é a prova de que o tempo só melhora o que é genuíno.",
    buttonLabel: "Os nossos produtos",
    backgroundImage: "/site/bg.jpg",
    image: "/site/intro.webp",
  },
  selection: {
    scriptText: "A nossa",
    title: "seleção da",
    text: "Todos os nossos pães são feitos com a nossa **massa mãe caseira**.\n\nDesde pequenos pães a pão branco & pães especiais até aos sazonais, as nossas **receitas**, que desenvolvemos continuamente para satisfazer sempre os vossos **paladares.**",
    sideLabel: "A nossa gama de produtos",
    circleText: "Tradição de Padaria desde 1881",
    decorationImage: "/site/trigo.webp",
    image1: "/site/img1.jpg",
    image2: "/site/trinas2.jpeg",
    image3: "/site/trinas5.jpeg",
    image4: "/site/trinas3.jpeg",
  },
  about: {
    titleLine1: "Desde",
    titleLine2: "1881",
    text: "A **Padaria das Trinas** foi criada com o objectivo de trazer a tradição e a inovação para a cidade de Guimarães. Fundada em **1881** no coração do berço da nação portuguesa, a padaria rapidamente se tornou uma referência na arte da panificação tradicional.\n\nCombinando técnicas ancestrais com métodos modernos, a Padaria das Trinas mantém-se fiel às suas raízes vimaranenses, oferecendo produtos de excelência que refletem a rica herança gastronómica da região.",
    bigWord: "Trinas",
    sideLabel: "Tradição de Padaria desde 1881",
    circleText: "100 anos de trinas",
    image: "/site/creator.jpg",
  },
  local: {
    titleLine1: "de",
    titleLine2: "locais",
    heading: "Produtos locais",
    text: "Há já **100 anos** que obtemos a maior parte dos nossos ingredientes de **produtores locais.** Seja fruta, lacticínios ou produtos agrícolas. Assim, não só contribuímos para a preservação da agricultura local, como também dispensamos o uso de aditivos artificiais. **Tudo isto tendo em conta as mais recentes tendências e processos.**",
    bigWord: "regional",
    sideLabel: "Tradição em panificação desde 1881",
    circleText: "comprar local",
    image: "/site/trinas2.jpeg",
  },
  team: {
    titleLine1: "a tua",
    titleLine2: "equipa",
    heading: "Ambiente de Trabalho Familiar",
    text: "Devido à nossa **história empresarial**, é muito importante para nós, apesar do tamanho médio da empresa, criar uma **atmosfera familiar** e manter contacto pessoal com os funcionários.\n\nOferecemos diferentes modelos de horários de trabalho e, na medida em que o negócio quotidiano o permite, tentamos ter **consideração pelas questões pessoais** para dar aos nossos funcionários um equilíbrio equilibrado entre **trabalho e tempo livre**.",
    bigWord: "Familiar",
    sideLabel: "Tradição em panificação desde 1881",
    image: "/site/trinas4.jpeg",
  },
  map: {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2990.736313044383!2d-8.296252724751577!3d41.44494289242453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd24efe96d756fd3%3A0x6c33f88f54dd2b1!2sPadaria%20Das%20Trinas%20Lda!5e0!3m2!1spt-PT!2spt!4v1757354359127",
  },
  contacts: {
    title: "Contactos",
    address: "R. das Trinas 23,\n4800-168 Guimarães",
    phone: "253 412 036",
    email: "geral@padariadastrinas.pt",
    facebookLabel: "Facebook",
    facebookUrl: "https://www.facebook.com/Trinaspadaria/",
    copyright: "Padaria das Trinas © {ano} Todos os direitos reservados.",
    credit: "Website por Newbooky",
    creditUrl: "https://newbooky.com/",
  },
};

// Junta o que está guardado com os valores por defeito, campo a campo,
// para que campos novos ou vazios nunca deixem o site sem conteúdo.
export const mergeSiteContent = (stored?: Partial<Record<SiteSectionKey, Record<string, unknown>>> | null): SiteContentData => {
  const result = JSON.parse(JSON.stringify(siteContentDefaults)) as SiteContentData;
  if (!stored) return result;
  (Object.keys(result) as SiteSectionKey[]).forEach((section) => {
    const saved = stored[section];
    if (!saved) return;
    const target = result[section] as unknown as Record<string, string>;
    Object.keys(target).forEach((field) => {
      const value = saved[field];
      if (typeof value === "string") target[field] = value;
    });
  });
  return result;
};
