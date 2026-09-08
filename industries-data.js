// Industry content pulled from Figma. `ph:true` = placeholder image (awaiting Figma export).
window.INDUSTRIES = [
  {
    slug: "civil",
    tab: "Civil Infrastructure",
    title: "Civil Infrastructure",
    body: [
      "Dams, bridges, water reservoirs, and port structures demand a fusion of precision, safety, and cost-efficiency that conventional inspection methods struggle to deliver.",
      "The Seabot platform addresses the specific challenges faced by civil inspectors across all of these environments. Its modular payload capacity accommodates the NDT tools required for structural integrity assessments, corrosion mapping, weld inspections, and water quality monitoring, consolidating multiple inspection functions into a single deployment and eliminating the need for separate, costly equipment.",
    ],
    apps: [
      ["Dams & reservoirs:", "Comprehensive structural integrity assessments and underwater inspections of components traditionally difficult to access. Real-time data feedback allows inspectors to identify potential issues promptly and take preventive measures before they become structural risks."],
      ["Bridges:", "Condition monitoring, corrosion assessment, and non-destructive testing across submerged bridge elements. The ROV's precision navigation provides detailed insights into the structural soundness of critical components without damage."],
      ["Ports & decks:", "Access to areas challenging for human divers like submerged piers, underwater welds, vessel hulls, with pinpoint NDT accuracy and continuous operation that reduces downtime and maximizes inspection efficiency."],
    ],
    img1: "assets/ind-civil-1.png",
    img2: "assets/app-strip-2.png",
  },
  {
    slug: "oil",
    tab: "Oil & Gas",
    title: "Oil & Gas",
    body: [
      "Offshore oil and gas operations involve intricate subsea infrastructure; pipelines, wellheads, rigs, and underwater components, where precision, safety, and cost-efficiency are paramount. The environments are demanding, the stakes are high, and the challenges of deep-sea inspection have historically required significant operational risk and expense.",
      "The Seabot platform is engineered to navigate this complexity. Its modular payload capacity and extensive tool compatibility consolidate multiple inspection functions into a single solution: subsea infrastructure inspection, pipeline assessments, wall thickness measurement, and leak detection — eliminating the need for separate, specialized systems and reducing maintenance expenses.",
    ],
    apps: [
      ["Subsea infrastructure inspection:", "Thorough inspections of pipelines, wellheads, and underwater components with precision, providing critical structural insights without human risk in high-pressure, low-visibility environments."],
      ["Pipeline monitoring & thickness measurement:", "Continuous wall thickness data and corrosion assessments across pipeline spans, returning georeferenced datasets that support fitness-for-service evaluations and maintenance planning."],
      ["Leak detection:", "Real-time data feedback enables prompt identification of anomalies and evolving conditions during offshore operations, allowing inspectors to respond before issues escalate."],
    ],
    img1: "assets/ind-oil-1.png",
    img2: "assets/ind-oil-2.png",
  },
  {
    slug: "offshore",
    tab: "Offshore Wind",
    title: "Offshore Wind",
    body: [
      "Offshore wind farms are built to last decades in some of the most demanding marine environments like turbulent waters, harsh weather, and continuous structural loading. The subsea foundations anchoring them require regular, thorough inspection to remain structurally sound and operationally compliant.",
      "The Seabot platform is designed for the full range of offshore wind inspection requirements. Its modular payload capacity allows a single deployment to cover multiple inspection objectives, from visual condition surveys to NDT measurements, consolidating cable, foundation, and turbine substructure assessments into one efficient mobilization.",
    ],
    apps: [
      ["Monopile & foundation inspection:", "Structural integrity assessments of monopile foundations, transition pieces, and jacket structures, including weld condition, corrosion mapping, and wall thickness measurements at critical zones."],
      ["Scour monitoring:", "Assessment of seabed conditions around foundation bases to identify scour development and inform remediation decisions before structural risk increases."],
      ["Underwater cable inspection:", "Thorough inspection of inter-array cables and J-tubes, identifying damage, burial depth variations, and integrity issues across the full cable route."],
      ["Cathodic protection surveys:", "Measurement of CP potential across foundation structures to verify protection system performance and identify depleted anode zones requiring intervention."],
    ],
    img1: "assets/ind-offshore-1.png",
    img2: "assets/ind-offshore-2.png",
  },
  {
    slug: "hydro",
    tab: "Hydroelectric",
    title: "Hydroelectric",
    body: [
      "Hydroelectric facilities present some of the most demanding underwater inspection environments with powerful currents, confined access, low visibility, and infrastructure that is critical to continuous power generation. Conventional inspection methods are constrained by these conditions.",
      "The ROV's modular payload capacity allows a single deployment to cover the full scope of hydroelectric inspection requirements, from structural assessments to NDT measurements, consolidating multiple tasks into one efficient mobilization and minimizing the operational impact on facility uptime.",
    ],
    apps: [
      ["Dam face & intake structure inspection:", "Thorough visual and NDT assessments of dam faces, intake structures, gates, and screens, identifying erosion, structural deformation, concrete deterioration, and coating breakdown across submerged surfaces."],
      ["Penstock & underwater turbine inspection:", "Inspection of penstocks, draft tubes, and underwater turbine components where access is confined and currents are significant. The ROV conducts meticulous assessments with precision, without risking personnel in hazardous flow conditions."],
      ["Sediment & seabed assessment:", "Monitoring of sediment accumulation around intake structures and reservoir beds, providing data to support maintenance planning and operational efficiency decisions."],
      ["Structural NDT:", "Non-destructive testing of submerged concrete and steel components through wall thickness measurement, crack detection, and corrosion assessment which returns reliable, non-invasive data on the structural soundness of critical infrastructure."],
    ],
    img1: "assets/ind-hydro-1.png",
    img2: "assets/ind-hydro-2.png",
  },
  {
    slug: "science",
    tab: "Science & Research",
    title: "Science & Research",
    body: [
      "The offshore science and research industry demands precise, repeatable data collection across environments that are often challenging for human researchers because of turbulent waters, strong currents, and depths where conventional sampling methods fall short. The Seabot platform provides researchers with versatile, deployable tools that bring the full range of offshore data collection into a single mobilization.",
      "Its modular payload capacity accommodates the sensors and sampling tools required across a wide range of research disciplines, from physical oceanography to marine biology, consolidating multiple functions without the need for separate, specialized systems.",
    ],
    apps: [
      ["Water quality & sampling:", "Real-time measurement of temperature, salinity, chemical composition, and biological parameters across the water column, combined with structured collection of water and sediment samples at defined depths, to support environmental baseline surveys, impact assessments, and regulatory compliance programs."],
      ["Ecosystem & habitat mapping:", "High-definition video, geo-tagged stills, and spatial data collection for detailed mapping of underwater habitats, species distribution, and benthic community structure across defined survey areas."],
      ["Seabed & structural survey:", "Systematic documentation of seabed conditions, marine growth, and submerged infrastructure for longitudinal monitoring programs and research requiring repeatable, georeferenced datasets over time."],
    ],
    img1: "assets/ind-science-1.png",
    img2: "assets/ind-science-2.png",
  },
  {
    slug: "shipping",
    tab: "Shipping & Marine",
    title: "Ports & Maritime Transportation",
    body: [
      "Ports, docks, and vessels house complex underwater infrastructure that requires regular inspection to maintain structural integrity, class compliance, and operational safety.",
      "Tidal constraints, vessel traffic, and the linear extent of port structures make conventional inspection campaigns time-consuming and difficult to complete within available operational windows. The Seabot modular payload capacity allows a single deployment to address the full range of shipping and marine transportation inspection requirements, vessel hull assessments, port structure surveys, and NDT measurements, consolidating multiple tasks without the need for separate, specialized equipment.",
    ],
    apps: [
      ["Vessel hull inspection:", "Visual condition surveys and wall thickness measurements across vessel shell plating, identifying corrosion, coating breakdown, and structural anomalies. Conducted in-port without drydock, reducing operational downtime and mobilization costs."],
      ["Port & dock structure inspection:", "Thorough inspection of quay walls, fender piles, berth structures, and mooring infrastructure, capturing condition data across submerged surfaces that are difficult to access within standard tidal and traffic windows."],
      ["Underwater weld & NDT assessment:", "Non-destructive testing of submerged welds, joints, and structural connections on docks and vessel hulls, returning georeferenced flaw inventories and wall thickness datasets formatted to class society requirements."],
      ["Cathodic protection survey:", "Measurement of CP potential across submerged port structures and vessel hulls, identifying depleted anodes and areas of insufficient protection before corrosion becomes a structural risk."],
    ],
    img1: "assets/app-strip-3.png",
    img2: "assets/app-strip-2.png",
    ph: true,
  },
  {
    slug: "nuclear",
    tab: "Nuclear Energy",
    title: "Nuclear Energy",
    body: [
      "Nuclear power plants operate some of the most demanding and tightly regulated underwater inspection environments with cooling water intake structures, submerged infrastructure within spent fuel pools, and underwater components of reactor cooling systems where precision, traceability, and zero-tolerance for error are non-negotiable requirements.",
      "The Seabot platform is designed for confined, high-consequence underwater environments. Its modular payload capacity allows a single deployment to conduct thorough, non-invasive assessments of critical submerged components without placing personnel in radiologically sensitive or physically hazardous areas.",
    ],
    apps: [
      ["Cooling system & intake structure inspection:", "Visual condition surveys and structural assessments of cooling water intake screens, pipework, and associated underwater infrastructure and identifying fouling, structural degradation, and foreign object presence without operational shutdown."],
      ["Submerged component NDT:", "Non-destructive testing of submerged structural elements within nuclear facilities, including wall thickness measurement, corrosion assessment, and weld condition surveys, returning precise, traceable datasets to regulatory and maintenance standards."],
      ["Confined space & restricted access inspection:", "Navigation through confined underwater environments where access is restricted and conventional inspection methods are impractical, delivering high-definition visual documentation and real-time data feedback from areas inaccessible to personnel."],
      ["Radiation monitoring:", "Real-time measurement of radiation levels in underwater areas, enabling safe assessment of radiologically sensitive zones without exposing personnel to contamination risk."],
    ],
    img1: "assets/app-strip-1.png",
    img2: "assets/hero-background.png",
    ph: true,
  },
  {
    slug: "defense",
    tab: "Defense & Underwater",
    title: "Defense & Underwater Infrastructure Security",
    body: [
      "The offshore defense sector requires the same underwater documentation rigor as commercial infrastructure, but with added demands around confidentiality, rapid deployment, and operating in contested or restricted waters. The Seabot platform brings structured, geo-referenced inspection data to harbor, port, and naval asset security, without divers or larger naval support vessels. Its modular payload capacity adapts to defense-specific requirements, from routine infrastructure survey to rapid-response seabed assessment, consolidating multiple inspection functions into a single deployable system.",
    ],
    apps: [
      ["Naval mine countermeasures support:", "Seabed survey and anomaly mapping capabilities adaptable to mine countermeasures operations, supporting site clearance and object identification in defense contexts."],
      ["Harbor & port infrastructure survey:", "Systematic visual and structural documentation of naval berths, jetties, and submerged infrastructure, the same GVI and structural survey methods used in ports and civil work, applied to restricted-access facilities."],
      ["Seabed debris & anomaly mapping:", "Geo-referenced visual and sonar documentation of seabed obstructions or anomalies within a defined area, supporting site clearance assessments ahead of naval operations."],
      ["Rapid-deployment structural assessment:", "Fast-mobilization inspection for naval vessels, submerged cables, and defense infrastructure requiring urgent condition data."],
    ],
    img1: "assets/app-strip-4.png",
    img2: "assets/hero-background.png",
    ph: true,
  },
];
