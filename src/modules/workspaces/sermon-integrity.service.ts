import { Injectable } from '@nestjs/common';
import { ScriptureService } from '../scripture/scripture.service';
import { CitationValidatorService } from '../scripture/citation-validator.service';

export interface IntegrityReport {
  overallScore: number;
  balanced: boolean;
  issues: IntegrityIssue[];
  strengths: string[];
  recommendations: string[];
  pointAnalysis: PointIntegrity[];
  applicationAnalysis: ApplicationIntegrity[];
  citationAnalysis: CitationIntegrity[];
}

export interface IntegrityIssue {
  severity: 'critical' | 'warning' | 'info';
  category: 'textual_support' | 'relevance' | 'balance' | 'citation' | 'application';
  message: string;
  affectedItem?: string;
}

export interface PointIntegrity {
  point: string;
  textSupported: boolean;
  supportingVerses: string[];
  supportScore: number;
  issues: string[];
}

export interface ApplicationIntegrity {
  application: string;
  tiedToPassage: boolean;
  relevanceScore: number;
  issues: string[];
}

export interface CitationIntegrity {
  statement: string;
  verseReference: string;
  verified: boolean;
  supportLevel: 'supported' | 'weak' | 'not_supported';
  issues: string[];
}

@Injectable()
export class SermonIntegrityService {
  constructor(
    private scriptureService: ScriptureService,
    private citationValidator: CitationValidatorService
  ) {}

  async analyzeSermonIntegrity(sermonData: {
    mainPassage: string;
    outlinePoints: string[];
    applications: string[];
    citations: Array<{ statement: string; verseReferences: string[] }>;
    crossReferences?: string[];
    language?: string;
  }): Promise<IntegrityReport> {
    const isSpanish = String(sermonData.language || '').toLowerCase().startsWith('es');
    const issues: IntegrityIssue[] = [];
    const strengths: string[] = [];
    const recommendations: string[] = [];

    // Analyze outline points
    const pointAnalysis = await this.analyzeOutlinePoints(
      sermonData.mainPassage,
      sermonData.outlinePoints,
      isSpanish,
    );

    // Analyze applications
    const applicationAnalysis = await this.analyzeApplications(
      sermonData.mainPassage,
      sermonData.applications,
      isSpanish,
    );

    // Analyze citations
    const citationAnalysis = await this.analyzeCitations(sermonData.citations, isSpanish);

    // Collect issues
    pointAnalysis.forEach(p => {
      if (!p.textSupported) {
        issues.push({
          severity: 'critical',
          category: 'textual_support',
          message: isSpanish
            ? `El punto del bosquejo no muestra apoyo textual claro: "${p.point.substring(0, 50)}..."`
            : `Outline point lacks clear textual support: "${p.point.substring(0, 50)}..."`,
          affectedItem: p.point
        });
      } else if (p.supportScore < 0.5) {
        issues.push({
          severity: 'warning',
          category: 'textual_support',
          message: isSpanish
            ? `Apoyo textual débil para el punto: "${p.point.substring(0, 50)}..."`
            : `Weak textual support for point: "${p.point.substring(0, 50)}..."`,
          affectedItem: p.point
        });
      }
    });

    applicationAnalysis.forEach(a => {
      if (!a.tiedToPassage) {
        issues.push({
          severity: 'warning',
          category: 'application',
          message: isSpanish
            ? `La aplicación podría no estar claramente conectada al pasaje: "${a.application.substring(0, 50)}..."`
            : `Application may not be clearly tied to passage: "${a.application.substring(0, 50)}..."`,
          affectedItem: a.application
        });
      }
    });

    citationAnalysis.forEach(c => {
      if (c.supportLevel === 'not_supported') {
        issues.push({
          severity: 'critical',
          category: 'citation',
          message: isSpanish
            ? `La cita no está respaldada por el texto bíblico: ${c.verseReference}`
            : `Citation not supported by verse text: ${c.verseReference}`,
          affectedItem: c.statement
        });
      } else if (c.supportLevel === 'weak') {
        issues.push({
          severity: 'warning',
          category: 'citation',
          message: isSpanish
            ? `Respaldo débil de la cita: ${c.verseReference}`
            : `Weak citation support: ${c.verseReference}`,
          affectedItem: c.statement
        });
      }
    });

    // Identify strengths
    const wellSupportedPoints = pointAnalysis.filter(p => p.supportScore >= 0.7).length;
    if (wellSupportedPoints > 0) {
      strengths.push(
        isSpanish
          ? `${wellSupportedPoints} puntos del bosquejo tienen fuerte apoyo textual`
          : `${wellSupportedPoints} outline points have strong textual support`,
      );
    }

    const verifiedCitations = citationAnalysis.filter(c => c.supportLevel === 'supported').length;
    if (verifiedCitations > 0) {
      strengths.push(
        isSpanish
          ? `${verifiedCitations} citas están bien respaldadas por la Escritura`
          : `${verifiedCitations} citations are well-supported by Scripture`,
      );
    }

    const tiedApplications = applicationAnalysis.filter(a => a.tiedToPassage).length;
    if (tiedApplications > 0) {
      strengths.push(
        isSpanish
          ? `${tiedApplications} aplicaciones están claramente conectadas al pasaje`
          : `${tiedApplications} applications are clearly tied to the passage`,
      );
    }

    // Generate recommendations
    if (issues.some(i => i.category === 'textual_support')) {
      recommendations.push(
        isSpanish
          ? 'Revisa los puntos del bosquejo para asegurar que surjan del texto y no sean impuestos sobre él'
          : 'Review outline points to ensure they emerge from the text rather than being imposed on it',
      );
    }

    if (issues.some(i => i.category === 'citation')) {
      recommendations.push(
        isSpanish
          ? 'Verifica todas las citas bíblicas para asegurar precisión y contexto adecuado'
          : 'Verify all Scripture citations to ensure accuracy and proper context',
      );
    }

    if (issues.some(i => i.category === 'application')) {
      recommendations.push(
        isSpanish
          ? 'Fortalece la conexión entre las aplicaciones y el pasaje principal'
          : 'Strengthen the connection between applications and the main passage',
      );
    }

    // Calculate overall score
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const warningIssues = issues.filter(i => i.severity === 'warning').length;
    const totalItems = pointAnalysis.length + applicationAnalysis.length + citationAnalysis.length;
    
    let overallScore = 100;
    overallScore -= criticalIssues * 15;
    overallScore -= warningIssues * 5;
    overallScore = Math.max(0, Math.min(100, overallScore));

    const balanced = criticalIssues === 0 && warningIssues <= 2;

    return {
      overallScore,
      balanced,
      issues,
      strengths,
      recommendations,
      pointAnalysis,
      applicationAnalysis,
      citationAnalysis
    };
  }

  private async analyzeOutlinePoints(
    mainPassage: string,
    points: string[],
    isSpanish: boolean,
  ): Promise<PointIntegrity[]> {
    const results: PointIntegrity[] = [];
    
    try {
      const passage = await this.scriptureService.getPassage(mainPassage);
      const passageText = passage?.verses?.map((v: any) => v.text || '').join(' ') || '';

      for (const point of points) {
        const supportScore = this.calculateTextualSupport(point, passageText);
        const textSupported = supportScore >= 0.4;
        
        results.push({
          point,
          textSupported,
          supportingVerses: [mainPassage],
          supportScore,
          issues: textSupported
            ? []
            : [isSpanish ? 'El punto no surge claramente del texto del pasaje' : 'Point does not clearly emerge from the passage text']
        });
      }
    } catch (error) {
      // If passage retrieval fails, mark all as unsupported
      for (const point of points) {
        results.push({
          point,
          textSupported: false,
          supportingVerses: [],
          supportScore: 0,
          issues: [isSpanish ? 'No se pudo verificar el apoyo textual' : 'Could not verify textual support']
        });
      }
    }

    return results;
  }

  private async analyzeApplications(
    mainPassage: string,
    applications: string[],
    isSpanish: boolean,
  ): Promise<ApplicationIntegrity[]> {
    const results: ApplicationIntegrity[] = [];
    
    try {
      const passage = await this.scriptureService.getPassage(mainPassage);
      const passageText = passage?.verses?.map((v: any) => v.text || '').join(' ') || '';

      for (const app of applications) {
        const relevanceScore = this.calculateRelevance(app, passageText);
        const tiedToPassage = relevanceScore >= 0.3;
        
        results.push({
          application: app,
          tiedToPassage,
          relevanceScore,
          issues: tiedToPassage
            ? []
            : [isSpanish ? 'La conexión de la aplicación con el pasaje no es clara' : 'Application connection to passage is unclear']
        });
      }
    } catch (error) {
      for (const app of applications) {
        results.push({
          application: app,
          tiedToPassage: false,
          relevanceScore: 0,
          issues: [isSpanish ? 'No se pudo verificar la conexión con el pasaje' : 'Could not verify passage connection']
        });
      }
    }

    return results;
  }

  private async analyzeCitations(
    citations: Array<{ statement: string; verseReferences: string[] }>,
    isSpanish: boolean,
  ): Promise<CitationIntegrity[]> {
    const results: CitationIntegrity[] = [];

    for (const citation of citations) {
      for (const ref of citation.verseReferences) {
        const validation = await this.citationValidator.validateCitation(
          citation.statement,
          ref
        );

        results.push({
          statement: citation.statement,
          verseReference: ref,
          verified: validation.supportLevel === 'supported',
          supportLevel: validation.supportLevel,
          issues:
            validation.supportLevel === 'supported'
              ? []
              : [
                  isSpanish
                    ? this.translateCitationExplanation(validation.explanation)
                    : validation.explanation,
                ],
        });
      }
    }

    return results;
  }

  private calculateTextualSupport(point: string, passageText: string): number {
    const pointWords = point.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3);
    
    const passageWords = new Set(
      passageText.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3)
    );

    if (pointWords.length === 0) return 0;

    const matchedWords = pointWords.filter(w => passageWords.has(w));
    return matchedWords.length / pointWords.length;
  }

  private calculateRelevance(application: string, passageText: string): number {
    // Similar to textual support but with lower threshold
    return this.calculateTextualSupport(application, passageText) * 0.8;
  }

  private translateCitationExplanation(explanation: string): string {
    const value = String(explanation || '').trim();
    if (!value) return 'La cita necesita verificación adicional.';

    if (/not supported/i.test(value)) return 'La cita no está respaldada por el texto bíblico citado.';
    if (/weak/i.test(value)) return 'La cita muestra un respaldo débil y requiere revisión.';
    if (/context/i.test(value)) return 'La cita requiere una revisión de contexto.';
    if (/could not/i.test(value) || /unable/i.test(value)) return 'No se pudo verificar la cita con los datos disponibles.';
    return value;
  }
}
