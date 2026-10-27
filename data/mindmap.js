/* ============================================================
   Mindmap content.  Mirrors planning/research-method-anchors.md.

   NODE SCHEMA
     id        unique within the mode
     label     text on the node
     badge     small code shown above the label (A1, G1a, O3 …)
     takeaway  "my takeaway" - the claim this node licenses. Your words.
     refs      [{ key, quote, page }]  key -> data/refs.js
               a per-node `quote` overrides the one in refs.js
     fields    [{ k, v, tag }]  arbitrary labelled rows in the panel
     children  nested nodes
   ============================================================ */

window.THESIS_MINDMAP = {

  /* ======================= MODE: RESEARCH METHODS ======================= */
  methods: {
    title: "Research methods",
    desc: "How the topic is decomposed, and which reference licenses each move. " +
          "Hover a component for the takeaway plus its reference.",
    root: {
      id: "m-root",
      label: "Research method",
      children: [

        {
          id: "m-crit",
          label: "Decomposition criteria",
          scene: "title",
          sceneLabel: "See the title broken down",
          takeaway: "Four criteria govern whether the decomposition is sound. Two are argued " +
                    "from the literature; two are ours and are labelled as such.",
          children: [
            {
              id: "m-complete", label: "Completeness", badge: "C-1",
              takeaway: "Every title phrase has at least one component under it, and every " +
                        "component traces back to at least one phrase. Demonstrated by Axis A " +
                        "having no empty cells - not by citing a standard.",
              fields: [
                { k: "Status", v: "Our own stated criterion", tag: "own" },
                { k: "Originally", v: "PMI's 100% rule - dropped: not licensed, and " +
                     "project-management provenance is the wrong field for an engineering thesis." }
              ],
              refs: [{ key: "pmi2019wbs" }]
            },
            {
              id: "m-ortho", label: "Orthogonality", badge: "C-2",
              takeaway: "No two components answer the same question. Verified operationally: if " +
                        "two gaps share a refutation condition, the components overlap. That test " +
                        "is what split G1 into G1a and G1b.",
              fields: [{ k: "Argued from", v: "Parnas - information hiding, one concern per module" }],
              refs: [{ key: "parnas1972modules" }]
            },
            {
              id: "m-bound", label: "Component boundaries", badge: "C-3",
              takeaway: "Put the boundary where the thing most likely to change sits. For the " +
                        "gateway-placement question that means the boundary belongs at the " +
                        "jurisdiction decision: the law changes, the pipeline does not.",
              fields: [{ k: "Answers", v: "The open question from the 23/09 supervisor meeting" }],
              refs: [{ key: "parnas1972modules" }]
            },
            {
              id: "m-feas", label: "Feasibility & scope", badge: "C-4",
              takeaway: "Researcher judgement, labelled as judgement. Deliberately NOT dressed " +
                        "up as a formal criterion - doing so is easy to attack.",
              fields: [{ k: "Status", v: "Explicitly informal", tag: "own" }],
              refs: [{ key: "ratan2019rq" }, { key: "vanderbiltrq" }]
            }
          ]
        },

        {
          id: "m-axes",
          label: "Three axes",
          scene: "axes3d",
          sceneLabel: "Open the 3-D demo",
          takeaway: "One component set, decomposed three times. The title-phrase diagram is only " +
                    "the first axis; on its own it cannot express epistemic type or scope under A1.",
          children: [
            {
              id: "m-axisA", label: "Axis A - Scope", badge: "AXIS A",
              takeaway: "What the title commits us to. This is the existing topic-decomposition " +
                        "diagram; its job is completeness.",
              fields: [
                { k: "Artefact", v: "media/diagrams/SovereignFlow-1-Topic-decomposition" },
                { k: "Job", v: "Completeness - no orphan phrase, no orphan component" }
              ]
            },
            {
              id: "m-axisB", label: "Axis B - Epistemic type", badge: "AXIS B",
              takeaway: "Design problems build an artefact and are judged against stakeholder " +
                        "goals; knowledge questions are truth claims judged by measurement. This " +
                        "is the axis that unblocks the proposal, because the two belong in " +
                        "different chapters.",
              fields: [
                { k: "Exposes", v: "RQ1.1 is two things bolted together - build a 3-tier " +
                     "detector (design) and does it beat Presidio by ≥10 pp (knowledge)." },
                { k: "Consequence", v: "Deliverables O1-O7 are the design column; the master " +
                     "plan's acceptance thresholds are the knowledge column." }
              ],
              refs: [{ key: "wieringa2010relevance" }, { key: "hevner2010designresearch" }]
            },
            {
              id: "m-axisC", label: "Axis C - Criticality under A1", badge: "AXIS C",
              takeaway: "The 23/09 decision made A1 primary and A3 conditional on a decent A1 " +
                        "result by Q1 2027. The decomposition does not yet say this. Claiming G3 " +
                        "and G4 while executing A1 is the most attackable thing in the material.",
              fields: [
                { k: "Critical path", v: "O1 taxonomy + handbook · O2 dataset · O3 detector" },
                { k: "Support, not novelty", v: "O4 flow graph · O5 simulation (Chau)" },
                { k: "Open / Phase 2", v: "Gateway placement · anonymisation · dossier" }
              ]
            }
          ]
        },

        {
          id: "m-ds",
          label: "Design-science grounding",
          takeaway: "Justifies building artefacts as the contribution, and splitting the topic " +
                    "into design sub-problems and knowledge questions.",
          children: [
            {
              id: "m-a1", label: "Wieringa - problem choice", badge: "A1",
              takeaway: "Gives the design-problem / knowledge-question split, and insists problem " +
                        "choice be justified by relevance rather than novelty alone.",
              refs: [{ key: "wieringa2010relevance" }]
            },
            {
              id: "m-a2", label: "Hevner & Chatterjee", badge: "A2",
              takeaway: "An artefact - dataset, detector, graph - is itself a contribution. The " +
                        "relevance and rigour cycles justify both building and measuring.",
              refs: [{ key: "hevner2010designresearch" }]
            },
            {
              id: "m-a3", label: "Dresch et al. - DSR process", badge: "A3",
              takeaway: "The concrete step sequence the Phase-1 workflow follows.",
              fields: [{ k: "Replaces", v: "Peffers et al. (2007) - JMIS not licensed" }],
              refs: [{ key: "dresch2015dsr" }]
            },
            {
              id: "m-vaish", label: "Vaishnavi et al. - overview", badge: "orient",
              takeaway: "Most current survey of DSR methodology, philosophical grounding and " +
                        "outputs. Use to orient, not to carry an argument.",
              fields: [{ k: "Caution", v: "Grey literature - a living web document, not peer reviewed", tag: "warn" }],
              refs: [{ key: "vaishnavi2025dsris" }]
            }
          ]
        },

        {
          id: "m-survey",
          label: "Survey protocol",
          takeaway: "A gap is a falsifiable negative claim, so the evidence is a recorded search " +
                    "that failed to find a counterexample. Protocol fixed before searching.",
          children: [
            {
              id: "m-a4a", label: "Systematic mapping", badge: "A4a",
              takeaway: "Build a classification scheme, then count coverage per category. That is " +
                        "what the comparison table and the criteria columns are.",
              fields: [{ k: "Lead with this one", v: "Accessible twice over - ScienceDirect and ProQuest" }],
              refs: [{ key: "petersen2015mapping" }]
            },
            {
              id: "m-a4b", label: "SLR baseline", badge: "A4b",
              takeaway: "The baseline SE review guidelines, cited alongside Petersen as convention.",
              refs: [{ key: "kitchenham2007slr" }]
            },
            {
              id: "m-a4c", label: "Mapping-study origin", badge: "S3",
              takeaway: "Cite as the origin of the method; secondary to the 2015 update.",
              refs: [{ key: "petersen2008mapping" }]
            },
            {
              id: "m-matrix", label: "Concept × paper matrix", badge: "subst.",
              takeaway: "The comparison table's shape is a concept-centric matrix: components " +
                        "become the concept columns. The canonical source is unreadable here, so " +
                        "the structure is grounded on Petersen's classification scheme instead. " +
                        "The table does not change.",
              refs: [{ key: "webster2002review" }, { key: "petersen2015mapping" }]
            }
          ]
        },

        {
          id: "m-gaps",
          label: "Gap identification",
          takeaway: "Gaps get typed, and the limits of counting-based gap claims are stated " +
                    "openly rather than left for an examiner to raise.",
          children: [
            {
              id: "m-a5a", label: "Gap typology", badge: "A5a",
              takeaway: "Label each gap by type instead of calling everything 'a gap'. Evidence " +
                        "gaps are the weakest kind on their own.",
              fields: [{ k: "Open", v: "The exact label set still needs checking against the " +
                   "paper - the gap register assigns types from it.", tag: "warn" }],
              refs: [{ key: "muellerbloch2015gaps" }]
            },
            {
              id: "m-a5b", label: "Gap-spotting caveat", badge: "A5b",
              takeaway: "'Nobody did X for Vietnamese' invites the reply 'so do it, then'. Citing " +
                        "the critique shows the limitation is understood - and it is why the " +
                        "register leads with a method gap, not an evidence gap.",
              refs: [{ key: "alvesson2013lostway" }, { key: "sandberg2020problematizing" }]
            },
            {
              id: "m-fivefield", label: "Five-field gap entry", badge: "own",
              takeaway: "Claim, evidence, near-misses, type, refutation condition. The fifth is " +
                        "the one missing everywhere in the current write-ups - without it a gap " +
                        "is an assertion rather than a finding.",
              fields: [
                { k: "1 Claim", v: "Falsifiable negative statement with explicit scope" },
                { k: "2 Evidence", v: "The recorded search that found no counterexample" },
                { k: "3 Near-misses", v: "2-3 works, each reason given as a criterion code C1-C6" },
                { k: "4 Type", v: "Per the typology above" },
                { k: "5 Refutation", v: "“This gap dies if someone shows X”" }
              ]
            }
          ]
        }
      ]
    }
  },

  /* =================== MODE: RESEARCH QUESTIONS ↔ GAPS =================== */
  questions: {
    title: "Questions ↔ gaps",
    desc: "Each research question sits above the gaps it closes. Hover a gap for its claim, " +
          "type, search queries and refutation condition.",
    root: {
      id: "q-root",
      label: "RQs ↔ gaps",
      children: [
        {
          id: "q-rq11", label: "RQ1.1 - detector", badge: "RQ1.1",
          takeaway: "P/R/F1 of a 3-tier Vietnamese PII detector against Presidio and commercial " +
                    "services, plus in-path latency. Per Axis B this should be split: the detector " +
                    "is a design problem, the comparison is the knowledge question.",
          fields: [
            { k: "Thresholds", v: "micro-F1 ≥ 0.88 (→0.94) · rule-based IDs F1 ≥ 0.95 · " +
                 "+≥10 pp vs Presidio · FPR ≤ 4% · p95 ≤ 200 ms" },
            { k: "Deliverables", v: "O2 ViPII-Flow · O3 detector" }
          ],
          children: [
            {
              id: "q-g1a", label: "G1a - no VN statutory identifiers", badge: "G1a",
              takeaway: "Strongest form: Vietnamese NER was benchmarked across four campaigns over " +
                        "a decade and grew to 40 entity categories, yet no campaign includes a " +
                        "statutory personal-data identifier type. The field had ample opportunity " +
                        "and still did not cover it.",
              fields: [
                { k: "Type", v: "evidence", tag: "evidence" },
                { k: "Queries", v: "Q01, Q02, Q04, Q05, Q06" },
                { k: "Dies if", v: "any published Vietnamese corpus or model carries CCCD / MST / " +
                     "BHXH / plate as a label, with reported scores" }
              ]
            },
            {
              id: "q-g1b", label: "G1b - file-centric, not prompts", badge: "G1b",
              takeaway: "PII benchmarks target files and documents, not prompts, retrieval context " +
                        "or tool calls. Independent of G1a: an English prompt-PII benchmark kills " +
                        "this one and leaves G1a standing.",
              fields: [
                { k: "Type", v: "evidence", tag: "evidence" },
                { k: "Queries", v: "Q03" },
                { k: "Dies if", v: "an evaluated PII benchmark whose unit of input is a prompt or " +
                     "retrieved chunk exists, in any language" },
                { k: "Why split", v: "Was bundled into G1; different refutation conditions, so " +
                     "one label for both violated orthogonality." }
              ]
            }
          ]
        },
        {
          id: "q-rq12", label: "RQ1.2 - legal classification", badge: "RQ1.2",
          takeaway: "Accuracy of basic vs. sensitive classification under PDPL 91/2025, and " +
                    "agreement with legal experts.",
          fields: [
            { k: "Thresholds", v: "legal macro-F1 ≥ 0.85 · expert κ ≥ 0.70" },
            { k: "Deliverables", v: "O1 taxonomy + annotation handbook" }
          ],
          children: [
            {
              id: "q-g2", label: "G2 - no statutory sensitivity", badge: "G2",
              takeaway: "Tools stop at 'is this PII?'. None classify basic vs. sensitive against a " +
                        "named statute.",
              fields: [
                { k: "Type", v: "evidence", tag: "evidence" },
                { k: "Queries", v: "Q07, Q08, Q09, Q10" },
                { k: "Dies if", v: "a system reports accuracy on statutory sensitivity categories" },
                { k: "Risk", v: "Highest refutation risk in the register - GDPR Art. 9 " +
                     "automation would count.", tag: "warn" }
              ]
            },
            {
              id: "q-g5a", label: "G5a - no reliability baseline", badge: "G5a",
              takeaway: "The strongest gap in the register, and one of ours. It says the field has " +
                        "no reliability baseline for statutory legal labelling, which undermines " +
                        "the validity of any such classifier - ours included. A claim about the " +
                        "field's method, not its coverage, so it survives 'so what'. Lead the " +
                        "proposal's gap section with it.",
              fields: [
                { k: "Type", v: "method", tag: "method" },
                { k: "Queries", v: "Q17, Q18" },
                { k: "Dies if", v: "any κ or equivalent is reported for legal sensitivity " +
                     "categorisation by experts" }
              ]
            }
          ]
        },
        {
          id: "q-rq13", label: "RQ1.3 - flow graph", badge: "RQ1.3",
          takeaway: "Coverage and accuracy of a jurisdiction-labelled data-flow graph, including " +
                    "indirect flows through agents and tools. Under A1 this is engineering " +
                    "support, measured but not defended as the novelty claim.",
          fields: [
            { k: "Thresholds", v: "edge F1 ≥ 0.85 · indirect-flow recall ≥ 0.75 · jurisdiction accuracy ≥ 0.92" },
            { k: "Deliverables", v: "O4 flow graph · O5 simulation scenarios" }
          ],
          children: [
            {
              id: "q-g3", label: "G3 - lineage ignores jurisdiction", badge: "G3",
              takeaway: "Data-lineage work ignores jurisdiction; agent-leakage work ignores where " +
                        "inference actually runs.",
              fields: [
                { k: "Type", v: "evidence", tag: "evidence" },
                { k: "Queries", v: "Q11-Q14" },
                { k: "Dies if", v: "a lineage or tracing system labels edges with jurisdiction and evaluates it" },
                { k: "Scope under A1", v: "Documented as open rather than claimed closed", tag: "warn" }
              ]
            }
          ]
        },
        {
          id: "q-rq2", label: "RQ2.1 / RQ2.2 - Phase 2", badge: "RQ2.x",
          takeaway: "Utility loss per intervention strategy; block rate and added latency of the " +
                    "in-path gateway. Conditional on A3 being reachable by Q1 2027.",
          fields: [{ k: "Deliverables", v: "Phase 2 - enforcement gateway, dossier generator" }],
          children: [
            {
              id: "q-g4", label: "G4 - trade-off unquantified", badge: "G4",
              takeaway: "The protection/utility trade-off has never been quantified for " +
                        "Vietnamese, and in-path cost is unmeasured.",
              fields: [
                { k: "Type", v: "evidence", tag: "evidence" },
                { k: "Queries", v: "Q15, Q16" },
                { k: "Dies if", v: "a utility-loss study on Vietnamese de-identification, or an " +
                     "in-path latency measurement, exists" },
                { k: "Scope under A1", v: "Documented as open", tag: "warn" }
              ]
            }
          ]
        },
        {
          id: "q-own", label: "Our own gaps", badge: "own",
          takeaway: "Not inherited from the đề cương. These are the ones that make the register " +
                    "more than gap-spotting.",
          children: [
            {
              id: "q-g5b", label: "G5b - orthographic robustness", badge: "G5b",
              takeaway: "Robustness to Vietnamese orthographic variation - diacritic stripping, " +
                        "telex input, họ-đệm-tên ordering - is never evaluated. Cheap to turn " +
                        "into a result: perturb existing data, no new annotation needed.",
              fields: [
                { k: "Type", v: "empirical", tag: "empirical" },
                { k: "Queries", v: "Q19" },
                { k: "Dies if", v: "a PII or NER evaluation includes a diacritic or " +
                     "transliteration perturbation condition" }
              ]
            },
            {
              id: "q-g6", label: "G6 - fine-tune vs prompted LLM", badge: "G6 NEW",
              takeaway: "The gap the A1 decision actually creates. Under A1 the contribution is " +
                        "dataset plus fine-tuned model, so the first objection is 'why not just " +
                        "prompt a large multilingual model?'. In the register, that comparison " +
                        "becomes a planned result instead of a defensive scramble - and it is " +
                        "nearly free, since Tier-3 already needs an LLM arbiter.",
              fields: [
                { k: "Type", v: "empirical", tag: "empirical" },
                { k: "Status", v: "Proposed - not in the original four", tag: "new" },
                { k: "Queries", v: "Q20-Q22 drafted, not yet run" },
                { k: "Dies if", v: "a head-to-head comparison of a fine-tuned Vietnamese PII " +
                     "model against a prompted multilingual LLM on the same labels exists" }
              ]
            }
          ]
        }
      ]
    }
  },

  /* ========================= MODE: FINDINGS ========================= */
  findings: {
    title: "Findings",
    desc: "Where the evidence stands, what comes next, and the technical output as it lands. " +
          "The output branch is a placeholder until Phase-1 experiments run.",
    root: {
      id: "f-root",
      label: "Findings",
      children: [
        {
          id: "f-now", label: "Established so far",
          takeaway: "What is actually evidenced today, as opposed to planned.",
          children: [
            {
              id: "f-vlsp", label: "VLSP: 3 → 40 types, 0 statutory", badge: "W3",
              takeaway: "Across four campaigns (2016-2021) the Vietnamese NER entity taxonomy grew " +
                        "from 3 to 40 categories and never included a statutory identifier type. " +
                        "The single strongest piece of evidence for G1a.",
              fields: [
                { k: "Source", v: "VLSP 2016/2018/2020/2021 proceedings" },
                { k: "Corroboration", v: "Scored VN-lang (not VN-ids) independently by both members" }
              ]
            },
            {
              id: "f-table", label: "Comparison table filled", badge: "W2-3",
              takeaway: "16 works × 6 criteria, with NR / N/A notation and documented-feature vs " +
                        "measured-result separated. VLSP row expanded into 12a-12d, one per campaign.",
              fields: [{ k: "Evidence", v: "781 screening rows from 19 queries across 6 sources" }]
            },
            {
              id: "f-protocol", label: "Search protocol fixed", badge: "D03.3",
              takeaway: "Protocol settled before searching: 6 sources, verbatim queries per gap, " +
                        "inclusion/exclusion criteria, explicit stopping rule.",
              fields: [{ k: "Still open", v: "Near-miss write-ups - 2-3 per gap, reasons as C1-C6 codes", tag: "warn" }]
            }
          ]
        },
        {
          id: "f-next", label: "Next stages",
          takeaway: "Critical path under the A1 focus. The weekly schedule in the master plan is " +
                    "no longer authoritative until it is re-cut.",
          children: [
            {
              id: "f-n1", label: "Near-miss write-ups", badge: "now",
              takeaway: "The remaining W3 acceptance evidence, and the critical-path item for the " +
                        "proposal. 2-3 near-misses per gap, each reason stated as a criterion code.",
              fields: [{ k: "Blocks", v: "The gap section of the proposal" }]
            },
            {
              id: "f-n2", label: "Taxonomy + annotation handbook", badge: "O1",
              takeaway: "The real blocker: it gates W4-6 annotation, which gates Tier-2/3 training. " +
                        "Legal expert still not secured.",
              fields: [
                { k: "Risk", v: "Open since W1 - needed for handbook review and the RQ1.2 expert-κ measurement", tag: "warn" },
                { k: "Also open", v: "Backup second annotator unnamed; κ ≥ 0.72 cannot be produced alone" }
              ]
            },
            {
              id: "f-n3", label: "Run G6 queries", badge: "G6",
              takeaway: "Q20-Q22 are drafted but not run. Until they are, G6 is a proposal rather " +
                        "than a validated gap.",
              fields: [{ k: "Where", v: "codes/google-schoolar_scraper/queries.csv" }]
            },
            {
              id: "f-n4", label: "ViPII-Flow dataset", badge: "O2",
              takeaway: "≥6,000 samples (→9,000), κ ≥ 0.72 on ≥600, rejection ≤ 12%. Synthetic-first " +
                        "by design; real data only for out-of-sample validation.",
              fields: [{ k: "Gate", v: "M2 - freezing v1.0 unblocks Tier-2/3 training" }]
            }
          ]
        },
        {
          id: "f-out", label: "Technical output",
          takeaway: "Placeholder. Each node fills in as the experiment runs - every metric " +
                    "traceable to a dataset snapshot, command and seed.",
          fields: [{ k: "Status", v: "Awaiting Phase-1 experiments", tag: "warn" }],
          children: [
            {
              id: "f-o3", label: "3-tier detector", badge: "O3",
              takeaway: "To be filled: micro-F1, per-tier breakdown, Presidio delta, FPR, p95 latency.",
              fields: [{ k: "Status", v: "not started", tag: "warn" }]
            },
            {
              id: "f-o4", label: "Flow graph", badge: "O4",
              takeaway: "To be filled: edge F1, indirect-flow recall, jurisdiction accuracy.",
              fields: [{ k: "Status", v: "not started", tag: "warn" }]
            },
            {
              id: "f-o6", label: "Dashboard + pipeline", badge: "O6",
              takeaway: "To be filled: reverse query (data type → all paths), clean-machine redeploy.",
              fields: [{ k: "Status", v: "not started", tag: "warn" }]
            }
          ]
        }
      ]
    }
  },

  /* ================ MODE: TRACEABILITY  (suggested) ================ */
  traceability: {
    title: "Traceability",
    suggested: true,
    desc: "Suggested mode - mirrors SovereignFlow-2-Traceability. Reading a branch across " +
          "answers the defence question “how did you choose your gaps, RQs and criteria?”: " +
          "they are the title, decomposed.",
    root: {
      id: "t-root",
      label: "Title, decomposed",
      children: [
        {
          id: "t-p4", label: "4 · in Vietnam", badge: "phrase",
          takeaway: "Scopes everything above it: Vietnamese language plus statutory identifiers - " +
                    "CCCD, MST, BHXH, plates, diacritics, họ-đệm-tên.",
          children: [
            { id: "t-p4g", label: "G1a - no VN statutory identifiers", badge: "gap" },
            { id: "t-p4q", label: "RQ1.1 - detector vs baselines", badge: "RQ" },
            { id: "t-p4c", label: "C1 - Vietnamese support", badge: "criterion",
              fields: [{ k: "Scale", v: "EN / multi / VN-lang / VN-ids" }] }
          ]
        },
        {
          id: "t-p1", label: "1 · for AI", badge: "phrase",
          takeaway: "Build the dataset and the safeguard model; the pipeline context is prompts, " +
                    "retrieval and tool calls rather than files.",
          children: [
            { id: "t-p1g", label: "G1b - file-centric benchmarks", badge: "gap" },
            { id: "t-p1q", label: "RQ1.1 - prompt / retrieval data", badge: "RQ" },
            { id: "t-p1c", label: "C2 + C4 - approach & AI context", badge: "criterion" }
          ]
        },
        {
          id: "t-p2a", label: "2 · personal data (legal)", badge: "phrase",
          takeaway: "Personal data in its statutory meaning, grounded in PDPL 91/2025 and " +
                    "Decree 356/2025, with Decree 13/2023 as the superseded predecessor.",
          children: [
            { id: "t-p2ag", label: "G2 - no statutory sensitivity", badge: "gap" },
            { id: "t-p2aq", label: "RQ1.2 - basic/sensitive + expert κ", badge: "RQ" },
            { id: "t-p2ac", label: "C3 - legal classification", badge: "criterion",
              fields: [{ k: "Scale", v: "none / Western-framework / per-law" }] }
          ]
        },
        {
          id: "t-p2b", label: "2 · cross-border monitoring", badge: "phrase",
          takeaway: "Reconstruct where data goes, with jurisdiction on the edges, including " +
                    "indirect flows via agents and tools.",
          children: [
            { id: "t-p2bg", label: "G3 - lineage ignores jurisdiction", badge: "gap" },
            { id: "t-p2bq", label: "RQ1.3 - jurisdiction-labelled graph", badge: "RQ" },
            { id: "t-p2bc", label: "C5 - flow & jurisdiction", badge: "criterion",
              fields: [{ k: "Scale", v: "none / lineage / jurisdiction (+indirect)" }] }
          ]
        },
        {
          id: "t-p3", label: "3 · enforcement system", badge: "phrase",
          takeaway: "Act on what is observed: in-path gateway, anonymisation, leakage trace. " +
                    "Phase 2, and conditional under the A1 decision.",
          children: [
            { id: "t-p3g", label: "G4 - trade-off unquantified", badge: "gap" },
            { id: "t-p3q", label: "RQ2.1 / RQ2.2 - utility & cost", badge: "RQ" },
            { id: "t-p3c", label: "C6 - evaluation & feasibility", badge: "criterion" }
          ]
        }
      ]
    }
  },

  /* ================ MODE: DELIVERABLES  (suggested) ================ */
  deliverables: {
    title: "Deliverables",
    suggested: true,
    desc: "Suggested mode - the design column of Axis B, with each acceptance threshold " +
          "(minimum → target) attached. Colour marks status under the A1 focus.",
    root: {
      id: "d-root",
      label: "O1 - O7",
      children: [
        {
          id: "d-crit", label: "Critical path under A1",
          takeaway: "The gaps the thesis claims to close.",
          children: [
            { id: "d-o1", label: "O1 - taxonomy + handbook", badge: "O1",
              takeaway: "Legal taxonomy plus the two-layer annotation handbook with an edge-case " +
                        "decision tree. Expert-reviewed.",
              fields: [{ k: "Status", v: "not started - blocks W4-6 annotation", tag: "warn" }] },
            { id: "d-o2", label: "O2 - ViPII-Flow dataset", badge: "O2",
              takeaway: "The corpus the whole A1 contribution rests on.",
              fields: [{ k: "Thresholds", v: "≥6,000 samples (→9,000) · κ ≥ 0.72 (→0.85) · rejection ≤ 12%" }] },
            { id: "d-o3", label: "O3 - 3-tier detector", badge: "O3",
              takeaway: "regex + checksum → fine-tuned NER → LLM arbiter, with legal classification.",
              fields: [{ k: "Thresholds", v: "micro-F1 ≥ 0.88 (→0.94) · IDs F1 ≥ 0.95 (→0.99) · " +
                   "+≥10 pp vs Presidio · FPR ≤ 4% · p95 ≤ 200 ms · legal macro-F1 ≥ 0.85 · κ ≥ 0.70" }] }
          ]
        },
        {
          id: "d-sup", label: "Support, not novelty",
          takeaway: "In Phase 1 per the đề cương, but reported as engineering support - measured, " +
                    "not defended as a contribution claim.",
          children: [
            { id: "d-o4", label: "O4 - flow-graph reconstruction", badge: "O4",
              fields: [{ k: "Thresholds", v: "edge F1 ≥ 0.85 (→0.93) · indirect recall ≥ 0.75 (→0.88) · jurisdiction acc ≥ 0.92 (→0.98)" }] },
            { id: "d-o5", label: "O5 - simulation scenarios", badge: "O5",
              fields: [{ k: "Thresholds", v: "≥8 AI-architecture scenarios · ≥150 labelled indirect flows · one-command deploy" }] },
            { id: "d-o6", label: "O6 - dashboard + pipeline", badge: "O6",
              fields: [{ k: "Thresholds", v: "reverse query: data type → all paths · clean-machine redeploy" }] }
          ]
        },
        {
          id: "d-rep", label: "Report & demo",
          children: [
            { id: "d-o7", label: "O7 - ĐACN report + demo", badge: "O7",
              takeaway: "Assembled from the writeups, not written from scratch at the end.",
              fields: [{ k: "Gate", v: "M5 - all Table-GĐ1 metrics ≥ minimum" }] }
          ]
        }
      ]
    }
  }
};

window.THESIS_MODE_ORDER = ["methods", "questions", "findings", "traceability", "deliverables"];
