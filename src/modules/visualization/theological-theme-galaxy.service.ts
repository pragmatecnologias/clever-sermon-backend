import { Injectable } from '@nestjs/common';

export interface ThemeNode {
  id: string;
  theme: string;
  reference: string;
  text: string;
  testament: 'OT' | 'NT';
  category: 'covenant' | 'kingdom' | 'salvation' | 'judgment' | 'worship' | 'prophecy';
  position: { x: number; y: number; z: number };
  size: number;
  color: string;
  importance: number;
}

export interface ThemeConnection {
  source: string;
  target: string;
  type: 'develops' | 'fulfills' | 'parallels' | 'contrasts';
  strength: number;
  color: string;
}

export interface ThemeGalaxy {
  nodes: ThemeNode[];
  connections: ThemeConnection[];
  clusters: {
    name: string;
    theme: string;
    nodes: string[];
    center: { x: number; y: number; z: number };
    color: string;
  }[];
  metadata: {
    totalNodes: number;
    totalConnections: number;
    primaryTheme: string;
  };
}

@Injectable()
export class TheologicalThemeGalaxyService {
  private themeData = {
    covenant: {
      abrahamic: [
        { ref: 'Genesis 12:1-3', text: 'I will make you a great nation', importance: 10 },
        { ref: 'Genesis 15:5', text: 'Your descendants as stars', importance: 9 },
        { ref: 'Genesis 17:7', text: 'Everlasting covenant', importance: 10 },
        { ref: 'Galatians 3:8', text: 'Gospel preached to Abraham', importance: 9 },
        { ref: 'Galatians 3:29', text: 'Abraham\'s seed', importance: 8 }
      ],
      mosaic: [
        { ref: 'Exodus 19:5-6', text: 'Kingdom of priests', importance: 10 },
        { ref: 'Exodus 24:7-8', text: 'Blood of covenant', importance: 9 },
        { ref: 'Deuteronomy 29:1', text: 'Covenant in Moab', importance: 8 },
        { ref: 'Hebrews 8:6-7', text: 'First covenant had faults', importance: 8 }
      ],
      davidic: [
        { ref: '2 Samuel 7:12-13', text: 'Throne forever', importance: 10 },
        { ref: 'Psalm 89:3-4', text: 'Covenant with David', importance: 9 },
        { ref: 'Luke 1:32-33', text: 'Throne of David', importance: 10 },
        { ref: 'Acts 2:30', text: 'Christ from David', importance: 9 }
      ],
      new: [
        { ref: 'Jeremiah 31:31-33', text: 'New covenant promised', importance: 10 },
        { ref: 'Luke 22:20', text: 'New covenant in blood', importance: 10 },
        { ref: 'Hebrews 8:8-10', text: 'New covenant established', importance: 10 },
        { ref: 'Hebrews 9:15', text: 'Mediator of new covenant', importance: 9 }
      ],
      fulfillment: [
        { ref: 'Revelation 21:3', text: 'God dwelling with people', importance: 10 },
        { ref: 'Revelation 22:3-5', text: 'No more curse', importance: 9 }
      ]
    },
    kingdom: {
      promised: [
        { ref: 'Daniel 2:44', text: 'Kingdom never destroyed', importance: 10 },
        { ref: 'Daniel 7:13-14', text: 'Everlasting dominion', importance: 10 }
      ],
      present: [
        { ref: 'Matthew 4:17', text: 'Kingdom at hand', importance: 9 },
        { ref: 'Luke 17:21', text: 'Kingdom within you', importance: 8 },
        { ref: 'Colossians 1:13', text: 'Transferred to kingdom', importance: 9 }
      ],
      future: [
        { ref: 'Matthew 25:31-34', text: 'Inherit the kingdom', importance: 9 },
        { ref: 'Revelation 11:15', text: 'Kingdom of our Lord', importance: 10 },
        { ref: 'Revelation 21:1', text: 'New heaven and earth', importance: 10 }
      ]
    },
    salvation: {
      promised: [
        { ref: 'Genesis 3:15', text: 'Seed of woman', importance: 10 },
        { ref: 'Isaiah 53:5', text: 'Wounded for us', importance: 10 }
      ],
      accomplished: [
        { ref: 'John 3:16', text: 'God so loved', importance: 10 },
        { ref: 'Romans 5:8', text: 'Christ died for us', importance: 10 },
        { ref: 'Ephesians 2:8-9', text: 'By grace through faith', importance: 10 }
      ],
      applied: [
        { ref: 'Romans 10:9-10', text: 'Confess and believe', importance: 9 },
        { ref: '1 John 1:9', text: 'Confess and cleansed', importance: 9 }
      ]
    }
  };

  async generateThemeGalaxy(theme: string): Promise<ThemeGalaxy> {
    const nodes: ThemeNode[] = [];
    const connections: ThemeConnection[] = [];
    const clusters: any[] = [];

    switch (theme.toLowerCase()) {
      case 'covenant':
        this.buildCovenantGalaxy(nodes, connections, clusters);
        break;
      case 'kingdom':
        this.buildKingdomGalaxy(nodes, connections, clusters);
        break;
      case 'salvation':
        this.buildSalvationGalaxy(nodes, connections, clusters);
        break;
      default:
        this.buildCovenantGalaxy(nodes, connections, clusters);
    }

    return {
      nodes,
      connections,
      clusters,
      metadata: {
        totalNodes: nodes.length,
        totalConnections: connections.length,
        primaryTheme: theme
      }
    };
  }

  private buildCovenantGalaxy(nodes: ThemeNode[], connections: ThemeConnection[], clusters: any[]): void {
    // Abrahamic cluster
    const abrahamicNodes = this.createCluster(
      'abrahamic',
      this.themeData.covenant.abrahamic,
      { x: -15, y: 0, z: 0 },
      '#fbbf24',
      'covenant'
    );
    nodes.push(...abrahamicNodes);
    clusters.push({
      name: 'Abrahamic Covenant',
      theme: 'covenant',
      nodes: abrahamicNodes.map(n => n.id),
      center: { x: -15, y: 0, z: 0 },
      color: '#fbbf24'
    });

    // Mosaic cluster
    const mosaicNodes = this.createCluster(
      'mosaic',
      this.themeData.covenant.mosaic,
      { x: -7, y: -5, z: 0 },
      '#3b82f6',
      'covenant'
    );
    nodes.push(...mosaicNodes);
    clusters.push({
      name: 'Mosaic Covenant',
      theme: 'covenant',
      nodes: mosaicNodes.map(n => n.id),
      center: { x: -7, y: -5, z: 0 },
      color: '#3b82f6'
    });

    // Davidic cluster
    const davidicNodes = this.createCluster(
      'davidic',
      this.themeData.covenant.davidic,
      { x: 0, y: 0, z: 0 },
      '#8b5cf6',
      'covenant'
    );
    nodes.push(...davidicNodes);
    clusters.push({
      name: 'Davidic Covenant',
      theme: 'covenant',
      nodes: davidicNodes.map(n => n.id),
      center: { x: 0, y: 0, z: 0 },
      color: '#8b5cf6'
    });

    // New Covenant cluster
    const newNodes = this.createCluster(
      'new',
      this.themeData.covenant.new,
      { x: 7, y: 5, z: 0 },
      '#10b981',
      'covenant'
    );
    nodes.push(...newNodes);
    clusters.push({
      name: 'New Covenant',
      theme: 'covenant',
      nodes: newNodes.map(n => n.id),
      center: { x: 7, y: 5, z: 0 },
      color: '#10b981'
    });

    // Fulfillment cluster
    const fulfillmentNodes = this.createCluster(
      'fulfillment',
      this.themeData.covenant.fulfillment,
      { x: 15, y: 0, z: 0 },
      '#ef4444',
      'covenant'
    );
    nodes.push(...fulfillmentNodes);
    clusters.push({
      name: 'Covenant Fulfillment',
      theme: 'covenant',
      nodes: fulfillmentNodes.map(n => n.id),
      center: { x: 15, y: 0, z: 0 },
      color: '#ef4444'
    });

    // Connect clusters showing progression
    this.connectClusters(abrahamicNodes, mosaicNodes, connections, 'develops', '#fbbf24');
    this.connectClusters(mosaicNodes, davidicNodes, connections, 'develops', '#3b82f6');
    this.connectClusters(davidicNodes, newNodes, connections, 'fulfills', '#8b5cf6');
    this.connectClusters(newNodes, fulfillmentNodes, connections, 'fulfills', '#10b981');
  }

  private buildKingdomGalaxy(nodes: ThemeNode[], connections: ThemeConnection[], clusters: any[]): void {
    // Promised Kingdom
    const promisedNodes = this.createCluster(
      'promised',
      this.themeData.kingdom.promised,
      { x: -10, y: 0, z: 0 },
      '#fbbf24',
      'kingdom'
    );
    nodes.push(...promisedNodes);
    clusters.push({
      name: 'Promised Kingdom',
      theme: 'kingdom',
      nodes: promisedNodes.map(n => n.id),
      center: { x: -10, y: 0, z: 0 },
      color: '#fbbf24'
    });

    // Present Kingdom
    const presentNodes = this.createCluster(
      'present',
      this.themeData.kingdom.present,
      { x: 0, y: 0, z: 0 },
      '#3b82f6',
      'kingdom'
    );
    nodes.push(...presentNodes);
    clusters.push({
      name: 'Present Kingdom',
      theme: 'kingdom',
      nodes: presentNodes.map(n => n.id),
      center: { x: 0, y: 0, z: 0 },
      color: '#3b82f6'
    });

    // Future Kingdom
    const futureNodes = this.createCluster(
      'future',
      this.themeData.kingdom.future,
      { x: 10, y: 0, z: 0 },
      '#10b981',
      'kingdom'
    );
    nodes.push(...futureNodes);
    clusters.push({
      name: 'Future Kingdom',
      theme: 'kingdom',
      nodes: futureNodes.map(n => n.id),
      center: { x: 10, y: 0, z: 0 },
      color: '#10b981'
    });

    // Connect progression
    this.connectClusters(promisedNodes, presentNodes, connections, 'fulfills', '#fbbf24');
    this.connectClusters(presentNodes, futureNodes, connections, 'develops', '#3b82f6');
  }

  private buildSalvationGalaxy(nodes: ThemeNode[], connections: ThemeConnection[], clusters: any[]): void {
    // Promised Salvation
    const promisedNodes = this.createCluster(
      'promised',
      this.themeData.salvation.promised,
      { x: -10, y: 0, z: 0 },
      '#fbbf24',
      'salvation'
    );
    nodes.push(...promisedNodes);

    // Accomplished Salvation
    const accomplishedNodes = this.createCluster(
      'accomplished',
      this.themeData.salvation.accomplished,
      { x: 0, y: 0, z: 0 },
      '#10b981',
      'salvation'
    );
    nodes.push(...accomplishedNodes);

    // Applied Salvation
    const appliedNodes = this.createCluster(
      'applied',
      this.themeData.salvation.applied,
      { x: 10, y: 0, z: 0 },
      '#3b82f6',
      'salvation'
    );
    nodes.push(...appliedNodes);

    // Connect
    this.connectClusters(promisedNodes, accomplishedNodes, connections, 'fulfills', '#fbbf24');
    this.connectClusters(accomplishedNodes, appliedNodes, connections, 'develops', '#10b981');
  }

  private createCluster(
    clusterName: string,
    data: any[],
    center: { x: number; y: number; z: number },
    color: string,
    category: any
  ): ThemeNode[] {
    return data.map((item, idx) => {
      const angle = (idx / data.length) * Math.PI * 2;
      const radius = 3;
      
      return {
        id: `${clusterName}-${idx}`,
        theme: clusterName,
        reference: item.ref,
        text: item.text,
        testament: this.getTestament(item.ref),
        category,
        position: {
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(idx) * 1.5,
          z: center.z + Math.sin(angle) * radius
        },
        size: item.importance / 10,
        color,
        importance: item.importance
      };
    });
  }

  private connectClusters(
    source: ThemeNode[],
    target: ThemeNode[],
    connections: ThemeConnection[],
    type: any,
    color: string
  ): void {
    // Connect central nodes of each cluster
    if (source.length > 0 && target.length > 0) {
      const sourceCenter = source[Math.floor(source.length / 2)];
      const targetCenter = target[Math.floor(target.length / 2)];
      
      connections.push({
        source: sourceCenter.id,
        target: targetCenter.id,
        type,
        strength: 0.9,
        color
      });
    }
  }

  private getTestament(reference: string): 'OT' | 'NT' {
    const otBooks = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 
                     'Judges', 'Ruth', 'Samuel', 'Kings', 'Chronicles', 'Ezra', 'Nehemiah',
                     'Esther', 'Job', 'Psalm', 'Proverbs', 'Ecclesiastes', 'Song', 'Isaiah',
                     'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
                     'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai',
                     'Zechariah', 'Malachi'];
    
    const book = reference.split(' ')[0];
    return otBooks.some(b => book.includes(b)) ? 'OT' : 'NT';
  }

  async getThemeProgression(theme: string): Promise<any> {
    const galaxy = await this.generateThemeGalaxy(theme);
    
    return {
      theme,
      progression: galaxy.clusters.map(c => ({
        stage: c.name,
        nodeCount: c.nodes.length,
        color: c.color
      })),
      totalNodes: galaxy.metadata.totalNodes,
      connections: galaxy.metadata.totalConnections
    };
  }
}
