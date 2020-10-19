(async () => {
    // Only run the script if the user has already been redirected
    if (!location.hash) {
        return;
    }
    // Extract the access token
    let params = new URLSearchParams(location.hash.slice(1));
    let token = params.get("access_token");
    // Parse out the character name and ID
    let payload = JSON.parse(atob(token.split(".")[1]));
    let name = payload.name;
    let id = payload.sub.split(":")[2];
    // Request the stats from ESI
    let response = await fetch(`https://esi.evetech.net/v2/characters/${id}/stats/?token=${token}`);
    if (!response.ok) {
        throw response.status;
    }
    let json = await response.json();
    // Pretty format the stats and save them as a file
    let blob = new Blob([JSON.stringify(json, null, "\t")], {type: "application/json"});
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${id} ${name}.json`;
    link.style.display = "none";
    document.body.append(link);
    link.click();
})().catch(alert);
