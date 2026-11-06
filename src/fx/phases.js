// Datos de las 5 fases (lámina 07 y A2): descripción = sección 1.4; herramientas y objetivo = tabla 5.1 de la investigación.
export const PHASES = [
  { n: 1, name: 'Reconocimiento', d: 'Recopilar información sobre el objetivo: dominios, IPs, tecnologías, empleados…', e: 'Mapear la superficie de ataque', tools: ['Nmap (descubrimiento)', 'SET (información de empleados)'] },
  { n: 2, name: 'Escaneo y enumeración', d: 'Identificar puertos abiertos, servicios activos y posibles vulnerabilidades con herramientas automatizadas.', e: 'Detectar servicios, versiones y vulnerabilidades', tools: ['Nmap -sV / -A', 'Nessus', 'OpenVAS', 'ZAP', 'Nikto'] },
  { n: 3, name: 'Explotación', d: 'Intento controlado de aprovechar las vulnerabilidades detectadas para comprobar su impacto real.', e: 'Comprobar el impacto real de una vulnerabilidad', tools: ['Metasploit', 'SET (vectores web y phishing)'] },
  { n: 4, name: 'Post-explotación', d: 'Analizar hasta dónde podría llegar un atacante: escalada de privilegios y movimiento lateral.', e: 'Evaluar hasta dónde podría llegar un atacante', tools: ['Metasploit (módulos post)', 'Wireshark'] },
  { n: 5, name: 'Elaboración de informes', d: 'Documentar con claridad los hallazgos, las evidencias y las recomendaciones de remediación.', e: 'Documentar hallazgos y remediaciones', tools: ['Exportadores de Nessus / OpenVAS / ZAP', 'Informes de SET'] }
];
