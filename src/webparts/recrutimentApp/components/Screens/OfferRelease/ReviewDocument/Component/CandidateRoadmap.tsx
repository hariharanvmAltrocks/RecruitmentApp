import { motion } from "framer-motion";
import { Check } from "lucide-react";
import strings, { Nationality } from "RecrutimentAppWebPartStrings";
import { getStageIndexinCandidate, CandidateStages, stages, CandidateStagesDRC, getStageIndexinCandidateDRC } from "../../../../../utilities/PositionStatusConfig";
import React from "react";
import { NationalityCode } from "../../../../../utilities/ConditionConfig";

export const CandidateRoadmap = React.memo(({ statusId }: { statusId: number, Nationality: string }) => {
    let CandidateStage
    let currentStage: any 
    if(Nationality === NationalityCode.Nationals){
         CandidateStage = CandidateStagesDRC
         currentStage = getStageIndexinCandidate(statusId);
    }else {
        CandidateStage = CandidateStages
        currentStage = getStageIndexinCandidateDRC(statusId);
    }

  return (
    <div className="advert-roadmap">
      <div className="advert-roadmap__container">
        {CandidateStage.map((stage, index) => {
          const Icon = stage.icon;
          const isCompleted = index < currentStage;   
          const isCurrent = index === currentStage;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="advert-roadmap__stage"
            >
              {/* Connector line */}
              {index < stages.length - 1 && (
                <div className="advert-roadmap__connector">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    className="advert-roadmap__connector-fill"
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              )}

              {/* Node */}
              <div className="advert-roadmap__node-wrapper">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className={`advert-roadmap__node ${
                    isCompleted
                      ? "advert-roadmap__node--completed"
                      : isCurrent
                        ? "advert-roadmap__node--current"
                        : "advert-roadmap__node--pending"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={18} strokeWidth={3} />
                  ) : (
                    <Icon size={18} strokeWidth={2} />
                  )}
                </motion.div>

                {isCurrent && (
                  <div className="advert-roadmap__ping-wrapper">
                    <span className="advert-roadmap__ping" />
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="advert-roadmap__label-wrapper">
                <span
                  className={`advert-roadmap__label ${
                    isCompleted
                      ? "advert-roadmap__label--completed"
                      : isCurrent
                        ? "advert-roadmap__label--current"
                        : "advert-roadmap__label--pending"
                  }`}
                >
                  {stage.label}
                </span>

                {isCompleted && (
                  <span className="advert-roadmap__status-done">{strings.Done}</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

CandidateRoadmap.displayName = "CandidateRoadmap";