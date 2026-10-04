/**
 * HomeLink Services Barrel Export
 * 
 * - api: Full REST API client (Properties, Roommates, Auth, AI, Visits, Chats)
 * - generateAIResponse: Offline heuristic fallback engine for AI Assistant
 * - locationService: GPS Auto-detection, reverse geocoding, and Haversine distance calculator
 */

export { generateAIResponse } from './aiAssistantService';
export { api, default as apiClient } from './api';
export * from './locationService';
