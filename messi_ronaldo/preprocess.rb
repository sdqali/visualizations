require "rubygems"
require "nokogiri"
require "json"

players = [{:name => "Cristiano Ronaldo", :id => 22774, :debut => 2003}, {:name => "Leonel Messi", :id => 45843, :debut => 2004}]

players.each do |p|
  doc = Nokogiri::HTML IO.read("./data/#{p[:name]}")
  trs = doc.search("tr").to_a.delete_if do |tr|
    !tr.search("td").first.text.strip.match /^[0-9]*\/[0-9]*\ [0-9]*$/
  end
  p[:performances] = []
  trs.map do |tr|
    tds = tr.search("td")
    next if tds.text.include? "Unused Substitute"
    performance = {
      :date => tds[0].text,
      :team => tds[1].text,
      :home => tds[2].text.start_with?("H-"),
      :opponent => tds[2].search("a").first.text,
      :competition => tds[3].text,
      :result => tds[4].text.split(" ").first,
      :score => tds[4].text.split(" ").last,
      :appearance => tds[5].text,
      :goals => tds[6].text.to_i,
      :assists => tds[7].text.to_i,
      :shots => tds[8].text.to_i,
      :shots_on_goal => tds[9].text.to_i,
      :fouls_committed => tds[10].text.to_i,
      :fouls_suffered => tds[11].text.to_i,
      :yellow_cards => tds[12].text.to_i,
      :red_cards => tds[13].text.to_i
    }
    p[:performances] << performance
  end
end
IO.write "./data/processed_data.json", players.to_json
