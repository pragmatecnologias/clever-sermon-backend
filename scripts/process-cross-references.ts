import { promises as fs } from 'fs';
import { resolve } from 'path';

interface CrossReference {
  from: string;
  to: string;
  votes: number;
}

const inputPath = process.argv[2] || '/tmp/cross_references.txt';
const outputPath = process.argv[3] || 'data/cross-references-enhanced.txt';

async function processCrossReferences() {
  console.log('Reading cross-reference data...');
  const content = await fs.readFile(inputPath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('From Verse'));
  
  console.log(`Processing ${lines.length} cross-references...`);
  
  const references: CrossReference[] = [];
  const bidirectionalMap = new Map<string, Set<string>>();
  
  for (const line of lines) {
    const parts = line.split('\t').filter(Boolean);
    if (parts.length < 2) continue;
    
    const from = parts[0].trim();
    const to = parts[1].trim();
    const votes = parts.length > 2 ? parseInt(parts[2]) : 0;
    
    // Only include references with positive votes (quality filter)
    if (votes >= 0) {
      references.push({ from, to, votes });
      
      // Build forward mapping
      if (!bidirectionalMap.has(from)) {
        bidirectionalMap.set(from, new Set());
      }
      bidirectionalMap.get(from)!.add(to);
      
      // Build reverse mapping (bidirectional)
      if (!bidirectionalMap.has(to)) {
        bidirectionalMap.set(to, new Set());
      }
      bidirectionalMap.get(to)!.add(from);
    }
  }
  
  console.log(`Filtered to ${references.length} quality references`);
  console.log(`Built bidirectional index with ${bidirectionalMap.size} unique verses`);
  
  // Write enhanced format: source target (one per line, bidirectional)
  const outputLines: string[] = [];
  const processed = new Set<string>();
  
  for (const [source, targets] of bidirectionalMap.entries()) {
    for (const target of targets) {
      const key = `${source}|${target}`;
      const reverseKey = `${target}|${source}`;
      
      // Avoid duplicates
      if (!processed.has(key) && !processed.has(reverseKey)) {
        outputLines.push(`${source} ${target}`);
        processed.add(key);
      }
    }
  }
  
  console.log(`Writing ${outputLines.length} bidirectional cross-references...`);
  await fs.writeFile(resolve(outputPath), outputLines.join('\n') + '\n');
  
  // Generate statistics
  const stats = {
    totalReferences: outputLines.length,
    uniqueVerses: bidirectionalMap.size,
    sampleVerses: {
      'Gen.1.1': bidirectionalMap.get('Gen.1.1')?.size || 0,
      'John.3.16': bidirectionalMap.get('John.3.16')?.size || 0,
      'Rom.8.28': bidirectionalMap.get('Rom.8.28')?.size || 0,
      'Ps.23.1': bidirectionalMap.get('Ps.23.1')?.size || 0,
    }
  };
  
  console.log('\nStatistics:');
  console.log(JSON.stringify(stats, null, 2));
  console.log(`\nSaved to ${resolve(outputPath)}`);
}

processCrossReferences().catch(console.error);
