/* ============================================================
   Bibliography.  Keys match refs/refs.bib in thesis-artifacts.
   Mirrors planning/research-method-anchors.md §7.

   FIELDS
     bib      formatted reference (what the panel prints)
     doi/isbn identifiers
     access   where it can be read
     file     path inside thesis-artifacts
     verify   fields still unconfirmed  ->  shown as a warning chip
     quote    VERBATIM quotation, only when actually read.
     page     page / section the quote or claim sits on

   NOTE ON QUOTES - every `quote` below is empty on purpose. Nothing is
   quoted here that has not been read and transcribed by hand. Fill them in
   as you read; the panel shows a "quote pending" chip until you do.
   Never let a generated quotation stand in a thesis.
   ============================================================ */

window.THESIS_REFS = {

  /* ---------- anchors ---------- */

  wieringa2010relevance: {
    bib: "Wieringa, R. J. (2010). Relevance and Problem Choice in Design Science. " +
         "In <em>Global Perspectives on Design Science Research</em> (DESRIST 2010, St. Gallen, " +
         "Switzerland), Lecture Notes in Computer Science, Vol. 6105, pp. 61-76. Springer.",
    doi: "10.1007/978-3-642-13335-0_5",
    isbn: "978-3-642-13335-0",
    access: "VNU: licensed (Springer eBooks). Volume PDF held locally.",
    file: "refs/05_methodologies/2010_DESRIST_Global-Perspectives-on-Design-Science-Research.pdf",
    page: "pp. 61-76 of the volume",
    quote: "",
    verify: ["editor list (believed Winter, Zhao & Aier)"]
  },

  hevner2010designresearch: {
    bib: "Hevner, A., & Chatterjee, S. (2010). <em>Design Research in Information Systems: " +
         "Theory and Practice</em>. Integrated Series in Information Systems, Vol. 22. Springer US.",
    doi: "10.1007/978-1-4419-5653-8",
    isbn: "978-1-4419-5652-1",
    access: "VNU: licensed (Springer eBooks). Held locally.",
    file: "refs/05_methodologies/2010_Hevner-Chatterjee_Design-Research-in-Information-Systems.pdf",
    quote: "",
    verify: []
  },

  dresch2015dsr: {
    bib: "Dresch, A., Lacerda, D. P., & Antunes, J. A. V., Jr. (2015). <em>Design Science " +
         "Research: A Method for Science and Technology Advancement</em>. Springer.",
    doi: "10.1007/978-3-319-07374-3",
    isbn: "978-3-319-07373-6",
    access: "VNU: licensed (Springer eBooks). Held locally.",
    file: "refs/05_methodologies/2015_Dresch-et-al_Design-Science-Research.pdf",
    quote: "",
    verify: ["author middle initials"]
  },

  petersen2015mapping: {
    bib: "Petersen, K., Vakkalanka, S., & Kuzniarz, L. (2015). Guidelines for conducting " +
         "systematic mapping studies in software engineering: An update. " +
         "<em>Information and Software Technology, 64</em>, 1-18.",
    doi: "10.1016/j.infsof.2015.03.007",
    access: "VNU: licensed twice - ScienceDirect (from 2007) and ProQuest. Held locally.",
    file: "refs/05_methodologies/2015_Petersen-et-al_Guidelines-Systematic-Mapping-Studies-SE-Update.pdf",
    quote: "",
    verify: ["DOI"]
  },

  kitchenham2007slr: {
    bib: "Kitchenham, B., & Charters, S. (2007). <em>Guidelines for Performing Systematic " +
         "Literature Reviews in Software Engineering</em>. EBSE Technical Report EBSE-2007-01. " +
         "Keele University and University of Durham.",
    access: "Open technical report. Held locally.",
    file: "refs/05_methodologies/2007_Kitchenham-Charters_Guidelines-Performing-SLR-Software-Engineering.pdf",
    quote: "",
    verify: ["version number", "report ID"]
  },

  petersen2008mapping: {
    bib: "Petersen, K., Feldt, R., Mujtaba, S., & Mattsson, M. (2008). Systematic Mapping " +
         "Studies in Software Engineering. In <em>Proceedings of EASE 2008</em>, Bari, Italy, pp. 68-77.",
    access: "Open author PDF. Held locally.",
    file: "refs/05_methodologies/2008_Petersen-et-al_Systematic-Mapping-Studies-in-Software-Engineering.pdf",
    quote: "",
    verify: ["page range", "publisher"]
  },

  muellerbloch2015gaps: {
    bib: "Müller-Bloch, C., & Kranz, J. (2015). A Framework for Rigorously Identifying Research " +
         "Gaps in Qualitative Literature Reviews. In <em>Proceedings of ICIS 2015</em>, " +
         "Fort Worth, TX. Association for Information Systems.",
    access: "Open access (AIS eLibrary). Held locally.",
    file: "refs/05_methodologies/2015_MullerBloch-Kranz_Framework-Rigorously-Identifying-Research-Gaps.pdf",
    quote: "",
    verify: ["paper number / pages", "THE EXACT GAP-TYPE LABEL SET used by the gap register"]
  },

  alvesson2013lostway: {
    bib: "Alvesson, M., & Sandberg, J. (2013). Has Management Studies Lost Its Way? Ideas for " +
         "More Imaginative and Innovative Research. <em>Journal of Management Studies, 50</em>(1), 128-152.",
    access: "VNU: licensed (ProQuest ABI/INFORM). Held locally.",
    file: "refs/05_methodologies/2013_Alvesson-Sandberg_Has-Management-Studies-Lost-Its-Way.pdf",
    quote: "",
    verify: ["DOI"]
  },

  sandberg2020problematizing: {
    bib: "Sandberg, J., & Alvesson, M. (2020). The Problematizing Review: A Counterpoint to " +
         "Elsbach and Van Knippenberg's Argument for Integrative Reviews. " +
         "<em>Journal of Management Studies, 57</em>(6), 1290-1304.",
    doi: "10.1111/joms.12582",
    access: "VNU: licensed (ProQuest). Held locally.",
    file: "refs/05_methodologies/2020_Sandberg-Alvesson_The-Problematizing-Review.pdf",
    quote: "",
    verify: []
  },

  parnas1972modules: {
    bib: "Parnas, D. L. (1972). On the Criteria To Be Used in Decomposing Systems into Modules. " +
         "<em>Communications of the ACM, 15</em>(12), 1053-1058.",
    doi: "10.1145/361598.361623",
    access: "CACM listed in ProQuest (confirm 1972 coverage). Held locally.",
    file: "refs/05_methodologies/1972_Parnas_On-the-Criteria-for-Decomposing-Systems-into-Modules.pdf",
    quote: "",
    verify: ["DOI", "ProQuest coverage reaches 1972"]
  },

  vaishnavi2025dsris: {
    bib: "Vaishnavi, V., Kuechler, W., & Duraisamy, S. (Eds.) (2025). " +
         "<em>Design Science Research in Information Systems</em>. Association for Information " +
         "Systems. Created 2004; last updated 15 December 2025.",
    access: "Open (AIS living document). Held locally.",
    file: "refs/05_methodologies/2025_Vaishnavi-et-al_Design-Science-Research-in-Information-Systems.pdf",
    quote: "",
    verify: [],
    caution: "Grey literature - a continuously revised web document, not peer reviewed. " +
             "Cite for orientation; keep Hevner & Chatterjee and Dresch et al. load-bearing."
  },

  ratan2019rq: {
    bib: "Ratan, S. K., Anand, T., & Ratan, J. (2019). Formulation of Research Question - " +
         "Stepwise Approach. <em>Journal of Indian Association of Pediatric Surgeons, 24</em>(1), 15-20.",
    access: "Held locally.",
    file: "refs/05_methodologies/2019_Ratan_FormulationRQ.pdf",
    quote: "",
    verify: ["ALL fields - the PDF is on disk, check it"]
  },

  vanderbiltrq: {
    bib: "Vanderbilt University. <em>Formulating Your Research Question</em> [institutional guide].",
    access: "Held locally.",
    file: "refs/05_methodologies/Vanderbilt-Formulating-Your-Research-Question.pdf",
    quote: "",
    verify: ["issuing office", "year", "filename still non-conforming"]
  },

  valiela2001doingscience: {
    bib: "Valiela, I. (2001). <em>Doing Science: Design, Analysis, and Communication of " +
         "Scientific Research</em>. Oxford University Press.",
    isbn: "0-19-513413-3",
    access: "Held locally.",
    file: "refs/05_methodologies/2001_Valiela_Doing-Science-Design-Analysis-and-Communication-of-Scientific-Research.pdf",
    quote: "",
    verify: ["edition - a 2nd ed. (2009) exists"]
  },

  /* ---------- identified but deliberately NOT used ---------- */

  webster2002review: {
    bib: "Webster, J., & Watson, R. T. (2002). Analyzing the Past to Prepare for the Future: " +
         "Writing a Literature Review. <em>MIS Quarterly, 26</em>(2), xiii-xxiii.",
    access: "NOT available - MIS Quarterly is in no VNU database (ISSN 0276-7783).",
    quote: "",
    verify: [],
    caution: "Origin of the concept-centric matrix, but unreadable here. The comparison " +
             "table is instead grounded on Petersen et al. (2015). Do not cite as if read."
  },

  hevner2004designscience: {
    bib: "Hevner, A. R., March, S. T., Park, J., & Ram, S. (2004). Design Science in " +
         "Information Systems Research. <em>MIS Quarterly, 28</em>(1), 75-105.",
    access: "NOT available via VNU. Superseded by Hevner & Chatterjee (2010).",
    quote: "",
    verify: ["DOI"],
    caution: "Kept on the record only. Do not cite as if read."
  },

  pmi2019wbs: {
    bib: "Project Management Institute. (2019). <em>Practice Standard for Work Breakdown " +
         "Structures</em> (3rd ed.). PMI.",
    access: "NOT licensed. A file of uncertain identity sits in personal/refs.",
    quote: "",
    verify: ["which publication the local PDF actually is", "edition year"],
    caution: "DROPPED by decision - see the Completeness node. Completeness is stated as " +
             "our own criterion, not borrowed from a project-management standard."
  }
};
