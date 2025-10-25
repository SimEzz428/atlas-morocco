// src/features/planner/utils/geo.ts
// Geographic utilities for trip planning and route optimization

export interface Point {
  id: string;
  lat: number;
  lon: number;
  name?: string;
}

export interface Route {
  points: Point[];
  totalDistance: number;
  totalTime: number; // in minutes
}

// Haversine formula to calculate distance between two points
export function haversineDistance(point1: Point, point2: Point): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(point2.lat - point1.lat);
  const dLon = toRadians(point2.lon - point1.lon);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Calculate travel time between two points (assuming average speed of 30 km/h in cities)
export function calculateTravelTime(point1: Point, point2: Point): number {
  const distance = haversineDistance(point1, point2);
  const averageSpeed = 30; // km/h
  return (distance / averageSpeed) * 60; // return minutes
}

// Nearest Neighbor algorithm for route optimization
export function nearestNeighbor(points: Point[]): Route {
  if (points.length === 0) {
    return { points: [], totalDistance: 0, totalTime: 0 };
  }
  
  if (points.length === 1) {
    return { points: [...points], totalDistance: 0, totalTime: 0 };
  }

  const visited = new Set<string>();
  const route: Point[] = [];
  if (points.length === 0) {
    return { points: [], totalDistance: 0, totalTime: 0 };
  }

  let currentPoint = points[0]!; // Start with first point
  let totalDistance = 0;
  let totalTime = 0;

  route.push(currentPoint);
  visited.add(currentPoint.id);

  while (visited.size < points.length) {
    let nearestPoint: Point | null = null;
    let minDistance = Infinity;

    for (const point of points) {
      if (!visited.has(point.id)) {
        const distance = haversineDistance(currentPoint, point);
        if (distance < minDistance) {
          minDistance = distance;
          nearestPoint = point;
        }
      }
    }

    if (nearestPoint) {
      const travelTime = calculateTravelTime(currentPoint, nearestPoint);
      totalDistance += minDistance;
      totalTime += travelTime;
      
      route.push(nearestPoint);
      visited.add(nearestPoint.id);
      currentPoint = nearestPoint;
    }
  }

  return { points: route, totalDistance, totalTime };
}

// 2-opt improvement algorithm
export function twoOptImprovement(route: Route): Route {
  if (route.points.length <= 2) {
    return route;
  }

  let improved = true;
  let bestRoute = { ...route };
  
  while (improved) {
    improved = false;
    
    for (let i = 1; i < bestRoute.points.length - 1; i++) {
      for (let j = i + 1; j < bestRoute.points.length; j++) {
        const newRoute = twoOptSwap(bestRoute.points, i, j);
        const newDistance = calculateRouteDistance(newRoute);
        
        if (newDistance < bestRoute.totalDistance) {
          const newTime = calculateRouteTime(newRoute);
          bestRoute = { points: newRoute, totalDistance: newDistance, totalTime: newTime };
          improved = true;
        }
      }
    }
  }
  
  return bestRoute;
}

// Perform 2-opt swap
function twoOptSwap(points: Point[], i: number, j: number): Point[] {
  const newRoute = [...points];
  const segment = newRoute.slice(i, j + 1).reverse();
  newRoute.splice(i, j - i + 1, ...segment);
  return newRoute;
}

// Calculate total distance for a route
export function calculateRouteDistance(points: Point[]): number {
  if (points.length <= 1) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalDistance += haversineDistance(points[i]!, points[i + 1]!);
  }
  return totalDistance;
}

// Calculate total time for a route
export function calculateRouteTime(points: Point[]): number {
  if (points.length <= 1) return 0;
  
  let totalTime = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalTime += calculateTravelTime(points[i]!, points[i + 1]!);
  }
  return totalTime;
}

// Optimize route using Nearest Neighbor + 2-opt improvement
export function optimizeRoute(points: Point[], useTwoOpt: boolean = true): Route {
  if (points.length === 0) {
    return { points: [], totalDistance: 0, totalTime: 0 };
  }

  // Start with Nearest Neighbor
  let route = nearestNeighbor(points);
  
  // Apply 2-opt improvement if requested and we have enough points
  if (useTwoOpt && points.length > 2) {
    route = twoOptImprovement(route);
  }
  
  return route;
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

// Format time for display
export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}min`;
}

// Calculate route statistics
export function getRouteStats(route: Route) {
  return {
    totalPoints: route.points.length,
    totalDistance: formatDistance(route.totalDistance),
    totalTime: formatTime(route.totalTime),
    averageTimePerPoint: route.points.length > 0 ? route.totalTime / route.points.length : 0,
  };
}