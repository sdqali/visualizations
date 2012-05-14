require "rubygems"
require "nokogiri"
require "json"
def ymd_format(date)
  matches = date.match /(\w+)\/(\w+)\s(\w+)/
  (matches[3] << matches[2] << matches[1]).to_i
end

players = [{:name => "Cristiano Ronaldo", :id => 22774, :debut => 2003}, {:name => "Leonel Messi", :id => 45843, :debut => 2004}]

players.each do |p|
  doc = Nokogiri::HTML IO.read("./data/#{p[:name]}")
  trs = doc.search("tr").to_a.delete_if do |tr|
    !tr.search("td").first.text.strip.match /^[0-9]*\/[0-9]*\ [0-9]*$/
  end
  p[:performances] = []
  trs.map do |tr|
    tds = tr.search("td")

    performance = {
      :date => tds[0].text.strip,
      :team => tds[1].text.strip,
      :home => tds[2].text.strip.start_with?("H-"),
      :opponent => tds[2].search("a").first.text.strip,
      :competition => tds[3].text.strip,
      :result => tds[4].text.strip.split(" ").first,
      :score => tds[4].text.strip.split(" ").last
    }
    if tds.text.include? "Unused Substitute"
      p[:performances] << performance
      next
    end
    performance.merge!({
                        :appearance => tds[5].text.strip,
                        :goals => tds[6].text.strip.to_i,
                        :assists => tds[7].text.strip.to_i,
                        :shots => tds[8].text.strip.to_i,
                        :shots_on_goal => tds[9].text.strip.to_i,
                        :fouls_committed => tds[10].text.strip.to_i,
                        :fouls_suffered => tds[11].text.strip.to_i,
                        :yellow_cards => tds[12].text.strip.to_i,
                        :red_cards => tds[13].text.strip.to_i
    })
    p[:performances] << performance
  end
  p[:performances].sort! { |a, b| ymd_format(a[:date]) <=> ymd_format(b[:date]) }
end

IO.write "./data/processed_data.json", players.to_json
