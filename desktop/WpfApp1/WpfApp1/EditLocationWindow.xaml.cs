using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using WpfApp1.Models;
using WpfApp1.Services;

namespace WpfApp1
{
    public partial class EditLocationWindow : Window
    {
        bool isSyncing;
        private LocationDTO location;
        public event EventHandler LocationEdited;

        public EditLocationWindow(LocationDTO location)
        {
            InitializeComponent();
            this.location = location;
            LoadLocationAsync();
        }
        private async Task<List<PrefectureDTO>> FetchPrefecturesAsync()
        {
            HttpResponseMessage response = await HttpClientService.Client.GetAsync("/api/locations/prefectures");
            response.EnsureSuccessStatusCode();
            string responseBody = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<PrefectureDTO>>(responseBody, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        private void LoadLocationAsync()
        {
            try
            {
                if (location != null)
                {
                    LocationNameTextBox.Text = location.LocationName;
                    PostalCodeTextBox.Text = location.Address.PostalCode;
                    CityTextBox.Text = location.Address.City;
                    StreetTextBox.Text = location.Address.Street;
                    CapacityTextBox.Text = location.MaxCapacity.ToString();
                    PhoneTextBox.Text = location.PhoneNumber;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error loading location details: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }


        private async void Save_Click(object sender, RoutedEventArgs e)
        {
            var location = new
            {
                id = this.location.Id,
                locationName = LocationNameTextBox.Text,
                address = new
                {
                    postalCode = PostalCodeTextBox.Text,
                    city = CityTextBox.Text,
                    street = StreetTextBox.Text,
                },
                maxCapacity = int.Parse(CapacityTextBox.Text),
                phoneNumber = PhoneTextBox.Text
            };

            var jsonContent = JsonSerializer.Serialize(location);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            try
            {
                var response = await HttpClientService.Client.PutAsync("/api/locations/update", content);
                response.EnsureSuccessStatusCode();
                MessageBox.Show("Location edited successfully!");

                LocationEdited?.Invoke(this, EventArgs.Empty);
                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error editing location: {ex.Message}");
            }
        }
    }
}