import { Injectable } from '@nestjs/common';
import { SDAAlignmentService, ContentScanResult } from '../llm/sda-alignment';

export interface ValidationReport {
  passed: boolean;
  score: number;
  scans: {
    outline?: ContentScanResult;
    manuscript?: ContentScanResult;
    applications?: ContentScanResult[];
    illustrations?: ContentScanResult[];
  };
  recommendations: string[];
}

@Injectable()
export class ContentValidatorService {
  /**
   * Validate sermon content for SDA doctrinal alignment
   */
  validateSermonContent(content: {
    outline?: any;
    manuscript?: any;
    applications?: any[];
    illustrations?: any[];
  }): ValidationReport {
    const scans: ValidationReport['scans'] = {};
    const recommendations: string[] = [];
    let totalIssues = 0;
    let totalChecks = 0;

    // Scan outline
    if (content.outline?.structure?.points) {
      const outlineText = content.outline.structure.points.join(' ');
      scans.outline = SDAAlignmentService.scanContent(outlineText);
      totalIssues += scans.outline.issues.length;
      totalChecks++;

      if (scans.outline.hasIssues) {
        scans.outline.issues.forEach(issue => {
          recommendations.push(`Outline: ${issue.suggestion}`);
        });
      }
    }

    // Scan manuscript
    if (content.manuscript?.content?.text) {
      scans.manuscript = SDAAlignmentService.scanContent(content.manuscript.content.text);
      totalIssues += scans.manuscript.issues.length;
      totalChecks++;

      if (scans.manuscript.hasIssues) {
        scans.manuscript.issues.forEach(issue => {
          recommendations.push(`Manuscript: ${issue.suggestion}`);
        });
      }
    }

    // Scan applications
    if (content.applications?.length) {
      scans.applications = [];
      content.applications.forEach((app, idx) => {
        const scan = SDAAlignmentService.scanContent(app.content || '');
        scans.applications!.push(scan);
        totalIssues += scan.issues.length;
        totalChecks++;

        if (scan.hasIssues) {
          scan.issues.forEach(issue => {
            recommendations.push(`Application ${idx + 1}: ${issue.suggestion}`);
          });
        }
      });
    }

    // Scan illustrations
    if (content.illustrations?.length) {
      scans.illustrations = [];
      content.illustrations.forEach((illus, idx) => {
        const scan = SDAAlignmentService.scanContent(illus.content || '');
        scans.illustrations!.push(scan);
        totalIssues += scan.issues.length;
        totalChecks++;

        if (scan.hasIssues) {
          scan.issues.forEach(issue => {
            recommendations.push(`Illustration ${idx + 1}: ${issue.suggestion}`);
          });
        }
      });
    }

    // Calculate score
    const score = totalChecks > 0 ? Math.round(((totalChecks - totalIssues) / totalChecks) * 100) : 100;
    const passed = score >= 80;

    return {
      passed,
      score,
      scans,
      recommendations
    };
  }

  /**
   * Auto-fix common issues in content
   */
  autoFixContent(content: string): string {
    return SDAAlignmentService.transformContent(content);
  }

  /**
   * Validate and transform if needed
   */
  validateAndTransform(content: string, autoFix: boolean = false): {
    original: string;
    transformed?: string;
    scan: ContentScanResult;
  } {
    const scan = SDAAlignmentService.scanContent(content);
    
    if (autoFix && scan.hasIssues) {
      return {
        original: content,
        transformed: SDAAlignmentService.transformContent(content),
        scan
      };
    }

    return {
      original: content,
      scan
    };
  }
}
