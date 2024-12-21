import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const HTMLContentProcessor = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const processContent = (htmlContent) => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // Remove ul tags and their content
    const ulElements = tempDiv.getElementsByTagName('ul');
    while (ulElements.length > 0) {
      ulElements[0].remove();
    }

    // Get text content excluding ul
    let content = tempDiv.innerHTML;

    // Remove default p tags but preserve content
    content = content.replace(/<p>/g, '').replace(/<\/p>/g, '');

    // Split content while preserving strong tags
    const strongRegex = /<strong>.*?<\/strong>/g;
    const strongMatches = content.match(strongRegex) || [];
    let processedContent = content;

    // Replace strong tags with placeholders
    strongMatches.forEach((match, index) => {
      processedContent = processedContent.replace(match, `___STRONG${index}___`);
    });

    // Split into roughly equal parts
    const words = processedContent.split(' ');
    const wordsPerPart = Math.ceil(words.length / 4);
    const parts = [];
    
    for (let i = 0; i < words.length; i += wordsPerPart) {
      parts.push(words.slice(i, i + wordsPerPart).join(' '));
    }

    // Restore strong tags
    let finalContent = parts.map(part => {
      let processed = part;
      strongMatches.forEach((match, index) => {
        processed = processed.replace(`___STRONG${index}___`, match);
      });
      return `<p class="d-inline">${processed}</p>`;
    }).join('&nbsp;');

    return finalContent;
  };

  const handleProcess = () => {
    const processed = processContent(input);
    setOutput(processed);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input HTML:</label>
          <Textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px]"
            placeholder="Paste your HTML content here..."
          />
        </div>
        
        <Button onClick={handleProcess} className="w-full">
          Process HTML
        </Button>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Output HTML:</label>
          <Textarea 
            value={output}
            readOnly
            className="min-h-[200px]"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Preview:</label>
          <div 
            className="p-4 border rounded-md"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HTMLContentProcessor;
