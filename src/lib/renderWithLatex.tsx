import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export function renderWithLatex(text: string) {
   if (!text) return null;

   // Regex to detect LaTeX expressions and bold text
   const inlineLatexRegex = /\$([^$]+)\$/g;
   const blockLatexRegex = /\$\$([^$]+)\$\$/g;
   const boldRegex = /\*\*([^*]+)\*\*/g;

   // First, split by block LaTeX
   const blockParts = text.split(blockLatexRegex);

   return (
      <>
         {blockParts.map((part, blockIndex) => {
            // Even indices are text (possibly with inline LaTeX or bold), odd indices are block LaTeX
            if (blockIndex % 2 === 0) {
               // Process inline LaTeX within this text part
               const inlineParts = part.split(inlineLatexRegex);

               return (
                  <React.Fragment key={`block-${blockIndex}`}>
                     {inlineParts.map((inlinePart, inlineIndex) => {
                        // Even indices are text (possibly with bold), odd indices are inline LaTeX
                        if (inlineIndex % 2 === 0) {
                           // Process bold text
                           const boldParts = inlinePart.split(boldRegex);

                           return (
                              <React.Fragment key={`inline-${inlineIndex}`}>
                                 {boldParts.map((boldPart, boldIndex) => {
                                    // Even indices are regular text, odd indices are bold text
                                    if (boldIndex % 2 === 0) {
                                       return <span key={`bold-${boldIndex}`}>{boldPart}</span>;
                                    } else {
                                       return <span key={`bold-${boldIndex}`} className="font-bold">{boldPart}</span>;
                                    }
                                 })}
                              </React.Fragment>
                           );
                        } else {
                           // This is inline LaTeX
                           try {
                              return <InlineMath key={`inline-${inlineIndex}`} math={inlinePart} />;
                           } catch (err) {
                              return <code key={`inline-${inlineIndex}`}>${inlinePart}$</code>;
                           }
                        }
                     })}
                  </React.Fragment>
               );
            } else {
               // This is block LaTeX
               try {
                  return <BlockMath key={`block-${blockIndex}`} math={part} />;
               } catch (err) {
                  return <pre key={`block-${blockIndex}`}><code>${part}$</code></pre>;
               }
            }
         })}
      </>
   );
}