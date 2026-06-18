import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { getStageIndexinCandidate, CandidateStages, stages, CandidateStagesDRC, getStageIndexinCandidateDRC } from "../../../../../utilities/PositionStatusConfig";
import React from "react";
import { NationalityCode } from "../../../../../utilities/ConditionConfig";
import strings from "RecrutimentAppWebPartStrings";
import { StatusId } from "../../../../../utilities/Config";

export const CandidateRoadmap = React.memo(({ statusId, Nationality }: { statusId: number, Nationality: string }) => {
    let CandidateStage
    let currentStage: any 
    if(Nationality === NationalityCode.Nationals){
         CandidateStage = CandidateStagesDRC
          currentStage = getStageIndexinCandidateDRC(statusId);
    }else {
        CandidateStage = CandidateStages
        currentStage = getStageIndexinCandidate(statusId);
    }

    
      const isRejectedStatus = (statusId: number) => {
        return (
          statusId === StatusId.BackgroundCheckVerificationFailed ||
          statusId === StatusId.CandidateRejectfromRESIProcess ||
          statusId === StatusId.offerdecline ||
          statusId === StatusId.FailedmedicalscreeningUnfit
        );
      };

  return (
    <div className="advert-roadmap">
      <div className="advert-roadmap__container">
        {CandidateStage.map((stage, index) => {
          const Icon = stage.icon;
          const isCompleted = index < currentStage;   
          const isCurrent = index === currentStage;
          const isRejected = isCurrent && isRejectedStatus(statusId);

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
                      : isRejected
                        ? "advert-roadmap__node--rejected"
                        : isCurrent
                          ? "advert-roadmap__node--current"
                          : "advert-roadmap__node--pending"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={18} strokeWidth={3} />
                  ) : isRejected ? (
                    <X size={18} strokeWidth={3} />
                  ) : (
                    <Icon size={18} strokeWidth={2} />
                  )}
                </motion.div>

                {isCurrent && !isRejected && (
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
                      : isRejected
                        ? "advert-roadmap__label--rejected"
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

                {isRejected && (
                  <span className="advert-roadmap__status-rejected">{strings.Rejected || "Rejected"}</span>
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