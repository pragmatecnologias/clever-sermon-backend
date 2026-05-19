
const { Client } = require('/Users/admin/CascadeProjects/clever-church/services/clever-sermon-backend/node_modules/pg');
const client = new Client({
  connectionString: 'postgres://admin:admin123@localhost:5432/clever_sermon',
});
async function main() {
  await client.connect();
  const wsId = 'a64a07a7-ec45-4542-810e-abad95198504';
  const passageSummary = "The Parable of the Prodigal Son - Luke 15:11-24 recounts a father with two sons. The younger son demands his inheritance early, squanders it in a distant land, then hits rock bottom. When he comes to his senses and returns home, the father runs to him, embraces him, and throws a lavish feast. The older brother protests, but the father affirms his grace to both. Key themes: repentance, forgiveness, the father's compassionate love, and celebration over restoration.";
  const sql = `UPDATE sermon_workspaces
SET scripture_cache = jsonb_build_object(
  'passageSummary', '${passageSummary.replace(/'/g, "''")}',
  'translationComparison', 'NRSV: The standard academic translation used for study.',
  'cachedAt', NOW()
)
WHERE id = '${wsId}'
RETURNING id, scripture_cache;`;
  const res = await client.query(sql);
  console.log(JSON.stringify(res.rows[0], null, 2));
  await client.end();
}
main().catch(e => console.log('ERROR:', e.message));
