// Performance monitoring utilities
class PerformanceMonitor {
  private metrics = new Map<string, number[]>();
  private readonly MAX_SAMPLES = 100;

  startTiming(label: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(label, duration);
    };
  }

  recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    
    const samples = this.metrics.get(label)!;
    samples.push(value);
    
    // Keep only recent samples
    if (samples.length > this.MAX_SAMPLES) {
      samples.shift();
    }
  }

  getMetrics(label: string): {
    avg: number;
    min: number;
    max: number;
    count: number;
  } | null {
    const samples = this.metrics.get(label);
    if (!samples || samples.length === 0) return null;

    return {
      avg: samples.reduce((sum, val) => sum + val, 0) / samples.length,
      min: Math.min(...samples),
      max: Math.max(...samples),
      count: samples.length
    };
  }

  getAllMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [label] of this.metrics) {
      result[label] = this.getMetrics(label);
    }
    
    return result;
  }

  // Monitor API response times
  async monitorApiCall<T>(
    label: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const endTiming = this.startTiming(label);
    
    try {
      const result = await apiCall();
      endTiming();
      return result;
    } catch (error) {
      endTiming();
      this.recordMetric(`${label}_error`, 1);
      throw error;
    }
  }

  // Monitor component render times
  measureRender(componentName: string): {
    start: () => void;
    end: () => void;
  } {
    let startTime: number;
    
    return {
      start: () => {
        startTime = performance.now();
      },
      end: () => {
        const duration = performance.now() - startTime;
        this.recordMetric(`render_${componentName}`, duration);
      }
    };
  }

  // Get performance insights
  getInsights(): {
    slowestOperations: Array<{ label: string; avgTime: number }>;
    errorRates: Array<{ label: string; errorCount: number }>;
    recommendations: string[];
  } {
    const allMetrics = this.getAllMetrics();
    const slowestOperations = Object.entries(allMetrics)
      .filter(([label]) => !label.includes('_error'))
      .map(([label, metrics]) => ({ label, avgTime: metrics.avg }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 5);

    const errorRates = Object.entries(allMetrics)
      .filter(([label]) => label.includes('_error'))
      .map(([label, metrics]) => ({ 
        label: label.replace('_error', ''), 
        errorCount: metrics.count 
      }));

    const recommendations: string[] = [];
    
    // Generate recommendations based on metrics
    slowestOperations.forEach(op => {
      if (op.avgTime > 1000) {
        recommendations.push(`Consider optimizing ${op.label} - average time: ${op.avgTime.toFixed(2)}ms`);
      }
    });

    errorRates.forEach(error => {
      if (error.errorCount > 5) {
        recommendations.push(`High error rate detected for ${error.label} - ${error.errorCount} errors`);
      }
    });

    return {
      slowestOperations,
      errorRates,
      recommendations
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const renderMonitor = performanceMonitor.measureRender(componentName);
  
  React.useEffect(() => {
    renderMonitor.start();
    return renderMonitor.end;
  });

  return {
    recordMetric: (label: string, value: number) => 
      performanceMonitor.recordMetric(`${componentName}_${label}`, value),
    monitorApiCall: <T>(label: string, apiCall: () => Promise<T>) =>
      performanceMonitor.monitorApiCall(`${componentName}_${label}`, apiCall)
  };
}