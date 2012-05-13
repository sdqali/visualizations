require 'rubygems'
require 'httpclient'

client = HTTPClient.new
players = [{:name => "Cristiano Ronaldo", :id => 22774, :debut => 2003}, {:name => "Leonel Messi", :id => 45843, :debut => 2004}]
players.each do |p|
  p[:raw_html] = ""
  (p[:debut]..Time.now.year).to_a.each do |season|
    puts "http://soccernet.espn.go.com/players/format/design09/showGameLog?playerId=#{p[:id]}&season=#{season}"
    p[:raw_html] << client.get("http://soccernet.espn.go.com/players/format/design09/showGameLog?playerId=#{p[:id]}&season=#{season}").body
    IO.write("./data/#{p[:name]}", p[:raw_html])
  end
end
