export function overrideParsedValues(
  json: string | Record<string, any>,
  variables: Record<string, any>
) {
  try {
    let stringifiend = typeof json === "string" ? json : JSON.stringify(json);
    const keys = Object.keys(variables);
    for (const key of keys) {
      stringifiend = stringifiend.replace(
        `"[${key}]"`,
        JSON.stringify(variables[key])
      );
    }

    return JSON.parse(stringifiend);
  } catch (e) {
    throw new Error("Error Parsing proof values");
  }
}
