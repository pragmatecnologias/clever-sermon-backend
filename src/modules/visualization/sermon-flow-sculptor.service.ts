import { Injectable } from '@nestjs/common';

export interface FlowNode {
  id: string;
  type: 'big_idea' | 'point' | 'application' | 'verse' | 'illustration';
  label: string;
  content: string;
  position: { x: number; y: number; z: number };
  size: number;
  color: string;
  strength?: number; // Connection strength to core idea
}

export interface FlowConnection {
  source: string;
  target: string;
  type: 'supports' | 'applies' | 'illustrates' | 'grounds';
  strength: number; // 0-1, visual thickness
  color: string;
  isWeak?: boolean;
}

export interface SermonFlowData {
  nodes: FlowNode[];
  connections: FlowConnection[];
  integrity: {
    score: number;
    balanced: boolean;
    weakPoints: string[];
    detachedApplications: string[];
    warnings: string[];
  };
}

@Injectable()
export class SermonFlowSculptorService {
  async generateSermonFlow(
    bigIdea: string,
    points: string[],
    applications: string[],
    supportingVerses: Record<string, string[]>,
    illustrations?: string[]
  ): Promise<SermonFlowData> {
    const nodes: FlowNode[] = [];
    const connections: FlowConnection[] = [];

    // Central big idea node
    nodes.push({
      id: 'big-idea',
      type: 'big_idea',
      label: 'Big Idea',
      content: bigIdea,
      position: { x: 0, y: 0, z: 0 },
      size: 3,
      color: '#fbbf24',
      strength: 1
    });

    // Points orbit around big idea
    points.forEach((point, idx) => {
      const angle = (idx / points.length) * Math.PI * 2;
      const radius = 8;
      
      const pointId = `point-${idx}`;
      nodes.push({
        id: pointId,
        type: 'point',
        label: `Point ${idx + 1}`,
        content: point,
        position: {
          x: Math.cos(angle) * radius,
          y: 0,
          z: Math.sin(angle) * radius
        },
        size: 2,
        color: '#3b82f6',
        strength: 0.8
      });

      // Connect point to big idea
      connections.push({
        source: 'big-idea',
        target: pointId,
        type: 'supports',
        strength: 0.8,
        color: '#3b82f6'
      });

      // Add supporting verses for this point
      const verses = supportingVerses[point] || supportingVerses[`point-${idx}`] || [];
      verses.forEach((verse, vIdx) => {
        const verseAngle = angle + (vIdx - verses.length / 2) * 0.3;
        const verseRadius = radius + 4;
        
        const verseId = `verse-${idx}-${vIdx}`;
        nodes.push({
          id: verseId,
          type: 'verse',
          label: verse,
          content: verse,
          position: {
            x: Math.cos(verseAngle) * verseRadius,
            y: -2,
            z: Math.sin(verseAngle) * verseRadius
          },
          size: 0.8,
          color: '#10b981',
          strength: 0.9
        });

        // Connect verse to point
        const verseStrength = verses.length > 0 ? 0.9 : 0.3;
        connections.push({
          source: pointId,
          target: verseId,
          type: 'grounds',
          strength: verseStrength,
          color: '#10b981',
          isWeak: verses.length === 0
        });
      });

      // If no verses, mark as weak
      if (verses.length === 0) {
        connections.push({
          source: pointId,
          target: 'big-idea',
          type: 'supports',
          strength: 0.2,
          color: '#ef4444',
          isWeak: true
        });
      }
    });

    // Applications extend outward
    applications.forEach((app, idx) => {
      const angle = (idx / applications.length) * Math.PI * 2;
      const radius = 12;
      
      const appId = `app-${idx}`;
      nodes.push({
        id: appId,
        type: 'application',
        label: `Application ${idx + 1}`,
        content: app,
        position: {
          x: Math.cos(angle) * radius,
          y: 3,
          z: Math.sin(angle) * radius
        },
        size: 1.5,
        color: '#8b5cf6',
        strength: 0.6
      });

      // Try to connect application to relevant point
      const connectedToPoint = this.connectApplicationToPoint(app, points, appId, connections);
      
      if (!connectedToPoint) {
        // Weak connection to big idea if no point connection
        connections.push({
          source: 'big-idea',
          target: appId,
          type: 'applies',
          strength: 0.3,
          color: '#ef4444',
          isWeak: true
        });
      }
    });

    // Add illustrations if provided
    if (illustrations) {
      illustrations.forEach((illus, idx) => {
        const angle = (idx / illustrations.length) * Math.PI * 2 + Math.PI / 4;
        const radius = 10;
        
        const illusId = `illus-${idx}`;
        nodes.push({
          id: illusId,
          type: 'illustration',
          label: `Illustration ${idx + 1}`,
          content: illus,
          position: {
            x: Math.cos(angle) * radius,
            y: -3,
            z: Math.sin(angle) * radius
          },
          size: 1.2,
          color: '#ec4899',
          strength: 0.5
        });

        // Connect to nearest point
        const nearestPoint = `point-${idx % points.length}`;
        connections.push({
          source: nearestPoint,
          target: illusId,
          type: 'illustrates',
          strength: 0.6,
          color: '#ec4899'
        });
      });
    }

    // Calculate integrity
    const integrity = this.calculateIntegrity(nodes, connections, points, applications);

    return {
      nodes,
      connections,
      integrity
    };
  }

  private connectApplicationToPoint(
    application: string,
    points: string[],
    appId: string,
    connections: FlowConnection[]
  ): boolean {
    // Simple keyword matching to connect application to relevant point
    const appWords = application.toLowerCase().split(/\s+/);
    
    for (let i = 0; i < points.length; i++) {
      const pointWords = points[i].toLowerCase().split(/\s+/);
      const overlap = appWords.filter(w => pointWords.includes(w) && w.length > 3).length;
      
      if (overlap >= 2) {
        connections.push({
          source: `point-${i}`,
          target: appId,
          type: 'applies',
          strength: 0.7,
          color: '#8b5cf6'
        });
        return true;
      }
    }
    
    return false;
  }

  private calculateIntegrity(
    nodes: FlowNode[],
    connections: FlowConnection[],
    points: string[],
    applications: string[]
  ): any {
    const weakConnections = connections.filter(c => c.isWeak);
    const weakPoints: string[] = [];
    const detachedApplications: string[] = [];
    const warnings: string[] = [];

    // Check for points without verses
    points.forEach((point, idx) => {
      const pointId = `point-${idx}`;
      const hasVerses = connections.some(
        c => c.source === pointId && c.type === 'grounds' && !c.isWeak
      );
      
      if (!hasVerses) {
        weakPoints.push(`Point ${idx + 1}`);
        warnings.push(`Point ${idx + 1} lacks scriptural grounding`);
      }
    });

    // Check for detached applications
    applications.forEach((app, idx) => {
      const appId = `app-${idx}`;
      const hasStrongConnection = connections.some(
        c => c.target === appId && c.strength > 0.5
      );
      
      if (!hasStrongConnection) {
        detachedApplications.push(`Application ${idx + 1}`);
        warnings.push(`Application ${idx + 1} not clearly derived from points`);
      }
    });

    // Calculate balance
    const pointNodes = nodes.filter(n => n.type === 'point');
    const verseNodes = nodes.filter(n => n.type === 'verse');
    const balanced = pointNodes.length > 0 && verseNodes.length >= pointNodes.length;

    // Calculate score
    const totalElements = points.length + applications.length;
    const weakElements = weakPoints.length + detachedApplications.length;
    const score = Math.max(0, Math.round(((totalElements - weakElements) / totalElements) * 100));

    return {
      score,
      balanced,
      weakPoints,
      detachedApplications,
      warnings
    };
  }

  async analyzeSermonBalance(flowData: SermonFlowData): Promise<any> {
    const pointCount = flowData.nodes.filter(n => n.type === 'point').length;
    const verseCount = flowData.nodes.filter(n => n.type === 'verse').length;
    const appCount = flowData.nodes.filter(n => n.type === 'application').length;

    return {
      pointCount,
      verseCount,
      appCount,
      versesPerPoint: pointCount > 0 ? (verseCount / pointCount).toFixed(1) : 0,
      appsPerPoint: pointCount > 0 ? (appCount / pointCount).toFixed(1) : 0,
      recommendation: this.getBalanceRecommendation(pointCount, verseCount, appCount)
    };
  }

  private getBalanceRecommendation(points: number, verses: number, apps: number): string {
    if (verses < points) {
      return 'Add more scriptural support for your points';
    }
    if (apps < points) {
      return 'Consider adding more practical applications';
    }
    if (points > 5) {
      return 'Consider consolidating points for clarity';
    }
    return 'Sermon structure is well-balanced';
  }
}
