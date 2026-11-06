// Datos de las 5 fases (los usa la lámina 07 y la actividad A2).
export const PHASES = [
  { n: 1, name: 'Reconocimiento', d: 'Recopilar información sobre el objetivo: dominios, IPs, tecnologías, empleados…', e: 'Mapa de la superficie de ataque', tools: ['Nmap (descubrimiento)', 'SET (información de empleados)'] },
  { n: 2, name: 'Escaneo y enumeración', d: 'Identificar puertos abiertos, servicios activos y posibles vulnerabilidades con herramientas automatizadas.', e: 'Inventario de servicios, versiones y vulnerabilidades probables', tools: ['Nmap -sV / -A', 'Nessus', 'OpenVAS', 'ZAP', 'Nikto'] },
  { n: 3, name: 'Explotación', d: 'Intento controlado de aprovechar las vulnerabilidades detectadas para comprobar su impacto real.', e: 'Evidencia de qué fallas sí se pudieron explotar', tools: ['Metasploit', 'SET (vectores web y phishing)'] },
  { n: 4, name: 'Post-explotación', d: 'Analizar hasta dónde podría llegar un atacante: escalada de privilegios y movimiento lateral.', e: 'Alcance real del ataque: privilegios y sistemas alcanzados', tools: ['Metasploit (módulos post)', 'Wireshark'] },
  { n: 5, name: 'Elaboración de informes', d: 'Documentar con claridad los hallazgos, las evidencias y las recomendaciones de remediación.', e: 'Informe con hallazgos, evidencias y plan de remediación', tools: ['Exportadores de Nessus / OpenVAS / ZAP', 'Informes de SET'] }
];
